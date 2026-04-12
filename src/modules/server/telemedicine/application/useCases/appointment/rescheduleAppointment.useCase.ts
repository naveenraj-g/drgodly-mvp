import { getTelemedicineInjection } from "../../../di/container";
import {
  TAppointment,
  TRescheduleAppointmentUseCase,
} from "../../../../../shared/entities/models/telemedicine/appointment";

export async function rescheduleAppointmentUseCase(
  rescheduleData: TRescheduleAppointmentUseCase
): Promise<TAppointment> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const { userId, appointmentId, orgId, ...rest } = rescheduleData;

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
    throw new Error("Appointment cannot be rescheduled");
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

  const isPending = appointment.status === "PENDING" && isPatient;
  const status = !isPending ? "RESCHEDULED" : "PENDING";

  // ** [MANDATORY]: check scheduling conflicts before booking, Check appointmentDate and time **

  const actorType: "PATIENT" | "DOCTOR" = isDoctor ? "DOCTOR" : "PATIENT";

  const data = await appointmentRepository.rescheduleAppointment(
    {
      userId,
      actorType,
      orgId,
      appointmentId,
      fromDate: appointment.appointmentDate,
      fromTime: appointment.time,
      ...rest,
    },
    status
  );

  return data;
}
