import { getTelemedicineInjection } from "../../../di/container";
import {
  TAppointment,
  TCancelAppointmentUseCase,
} from "../../../../../shared/entities/models/telemedicine/appointment";

export async function cancelAppointmentUseCase(
  cancelData: TCancelAppointmentUseCase
): Promise<TAppointment> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const { appointmentId, cancelReason, orgId, userId } = cancelData;

  if (!orgId) throw new Error("Organization is required");

  const appointment = await appointmentRepository.getAppointmentByIds(
    appointmentId,
    orgId
  );

  if (!appointment) throw new Error("Appointment not found");

  if (
    appointment.status === "CANCELLED" ||
    appointment.status === "COMPLETED"
  ) {
    throw new Error(
      `Cannot cancel an appointment in '${appointment.status}' state.`
    );
  }

  const [patientId, doctorId] = await Promise.all([
    idResolverRepository.resolvePatientIdByUserIdAndOrgId(userId, orgId),
    idResolverRepository.resolveDoctorIdByUserIdAndOrgId(userId, orgId),
  ]);

  const isPatient = !!patientId && patientId === appointment.patientId;
  const isDoctor = !!doctorId && doctorId === appointment.doctorId;

  if (!isPatient && !isDoctor) {
    throw new Error("You are not allowed to cancel this appointment.");
  }

  const actorType: "PATIENT" | "DOCTOR" = isDoctor ? "DOCTOR" : "PATIENT";

  const data = await appointmentRepository.cancelAppointment({
    appointmentId: appointment.id,
    cancelReason,
    orgId,
    userId,
    actorType,
  });

  return data;
}
