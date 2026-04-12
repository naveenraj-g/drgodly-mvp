import { TAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { getTelemedicineInjection } from "../../../di/container";

export async function getAppointmentForOnlineConsultationUseCase(
  appointmentId: string,
  orgId: string,
  userId: string
): Promise<TAppointment> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  if (!orgId) throw new Error("Organization is required");

  const appointment = await appointmentRepository.getAppointmentByIds(
    appointmentId,
    orgId
  );

  if (!appointment) throw new Error("Appointment not found");

  if (appointment.appointmentMode !== "VIRTUAL") {
    throw new Error("Invalid Operation.");
  }

  const [patientId, doctorId] = await Promise.all([
    idResolverRepository.resolvePatientIdByUserIdAndOrgId(userId, orgId),
    idResolverRepository.resolveDoctorIdByUserIdAndOrgId(userId, orgId),
  ]);

  const isPatient = !!patientId && patientId === appointment.patientId;
  const isDoctor = !!doctorId && doctorId === appointment.doctorId;

  if (!isPatient && !isDoctor) {
    throw new Error("You are not allowed to delete this appointment.");
  }

  if (isPatient && appointment.isPatientDeleted) {
    throw new Error("Invalid Operation.");
  }

  if (isDoctor && appointment.isDoctorDeleted) {
    throw new Error("Invalid Operation.");
  }

  const data = await appointmentRepository.getAppointmentForOnlineConsultation(
    appointment.id,
    orgId
  );

  if (!data) throw new Error("Appointment not found");

  return data;
}
