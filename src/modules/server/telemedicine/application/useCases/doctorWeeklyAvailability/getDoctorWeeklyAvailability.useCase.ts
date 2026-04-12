import { getTelemedicineInjection } from "../../../di/container";
import { TWeeklyAvailabilitiesPublic } from "../../../../../shared/entities/models/telemedicine/weeklyAvailability";

export async function getDoctorWeeklyAvailabilityUseCase(
  userId: string,
  orgId: string
): Promise<TWeeklyAvailabilitiesPublic> {
  const doctorWeeklyAvailabilityRepository = getTelemedicineInjection(
    "IDoctorWeeklyAvailabilityRepository"
  );
  const IdResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const doctorId = await IdResolverRepository.resolveDoctorIdByUserIdAndOrgId(
    userId,
    orgId
  );

  if (!doctorId) {
    throw new Error("Doctor not found");
  }

  const data =
    await doctorWeeklyAvailabilityRepository.getDoctorWeeklyAvailability(
      orgId,
      doctorId
    );

  return data;
}
