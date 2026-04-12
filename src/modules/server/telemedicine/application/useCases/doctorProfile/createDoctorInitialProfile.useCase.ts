import { TDoctorInitialProfile } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createDoctorInitialProfileUseCase(
  orgId: string,
  createdBy: string,
  isABDMDoctorProfile: boolean
): Promise<TDoctorInitialProfile> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );
  const data = await doctorProfileRepository.createDoctorInitialProfile(
    orgId,
    createdBy,
    isABDMDoctorProfile
  );
  return data;
}
