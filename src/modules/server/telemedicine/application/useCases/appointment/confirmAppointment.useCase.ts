import { getTelemedicineInjection } from "../../../di/container";
import {
  TAppointment,
  TConfirmAppointmentUseCase,
} from "../../../../../shared/entities/models/telemedicine/appointment";

export async function confirmAppointmentUseCase(
  confirmData: TConfirmAppointmentUseCase
): Promise<TAppointment> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const { appointmentId, orgId, userId } = confirmData;

  if (!orgId) throw new Error("Organization is required");

  const appointment = await appointmentRepository.getAppointmentByIds(
    appointmentId,
    orgId
  );

  if (!appointment) throw new Error("Appointment not found");

  if (
    appointment.status === "CANCELLED" ||
    appointment.status === "COMPLETED" ||
    appointment.status === "SCHEDULED"
  ) {
    throw new Error(
      `Cannot confirm an appointment in '${appointment.status}' state.`
    );
  }

  const doctorId = await idResolverRepository.resolveDoctorIdByUserIdAndOrgId(
    userId,
    orgId
  );

  if (!doctorId) throw new Error("Doctor not found");

  const isDoctor = !!doctorId && doctorId === appointment.doctorId;

  if (!isDoctor) {
    throw new Error("You are not allowed to cancel this appointment.");
  }

  const data = await appointmentRepository.confirmAppointment(
    appointment.id,
    userId,
    orgId
  );

  return data;
}
