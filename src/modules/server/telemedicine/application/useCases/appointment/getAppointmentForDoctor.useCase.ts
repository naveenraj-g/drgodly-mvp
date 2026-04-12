import { TAppointments } from "@/modules/shared/entities/models/telemedicine/appointment";
import { getTelemedicineInjection } from "../../../di/container";

export async function getAppointmentsForDoctorUseCase(
  userId: string,
  orgId: string
): Promise<TAppointments> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const doctorId = await idResolverRepository.resolveDoctorIdByUserIdAndOrgId(
    userId,
    orgId
  );

  if (!doctorId) {
    throw new Error("Doctor not found");
  }

  const data = await appointmentRepository.getAppointmentsForDoctor(
    doctorId,
    orgId
  );

  return data;
}
