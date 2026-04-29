import { getTelemedicineInjection } from "../../../di/container";
import {
  TAppointment,
  TCompleteConsultationUseCase,
} from "../../../../../shared/entities/models/telemedicine/appointment";

export async function completeConsultationUseCase(
  data: TCompleteConsultationUseCase
): Promise<TAppointment> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const { appointmentId, orgId, userId, doctorReport } = data;

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
      `Cannot complete an appointment in '${appointment.status}' state.`
    );
  }

  const doctorId = await idResolverRepository.resolveDoctorIdByUserIdAndOrgId(
    userId,
    orgId
  );

  if (!doctorId || doctorId !== appointment.doctorId) {
    throw new Error("You are not allowed to complete this appointment.");
  }

  return appointmentRepository.completeConsultation(
    appointment.id,
    userId,
    orgId,
    doctorReport
  );
}
