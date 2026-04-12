import { getTelemedicineInjection } from "../../../di/container";
import {
  TWeeklyAvailabilitiesPublic,
  TWeeklySchedulePayload,
} from "../../../../../shared/entities/models/telemedicine/weeklyAvailability";

export async function upsertDoctorWeeklyAvailabilityUseCase(
  userId: string,
  orgId: string,
  payload: TWeeklySchedulePayload
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

  const operationBy = userId;

  const data = await doctorWeeklyAvailabilityRepository.upsertFullWeek(
    orgId,
    doctorId,
    payload,
    operationBy
  );

  return data;
}
