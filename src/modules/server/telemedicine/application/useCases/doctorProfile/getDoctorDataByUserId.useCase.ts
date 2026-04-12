import { TDoctor } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function getDoctorDataByUserIdUseCase(
  userId: string,
  orgId: string
): Promise<TDoctor | null> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );
  const data = await doctorProfileRepository.getDoctorDataByUserId(
    userId,
    orgId
  );
  return data;
}
