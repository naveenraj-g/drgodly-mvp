import { TPatientInitialProfile } from "../../../../../shared/entities/models/telemedicine/patientProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createPatientInitialProfileUseCase(
  orgId: string,
  userId: string,
  createdBy: string,
  isABHAPatientProfile: boolean
): Promise<TPatientInitialProfile> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IPatientProfileRepository"
  );
  const data = await doctorProfileRepository.createPatientInitialProfile(
    orgId,
    userId,
    createdBy,
    isABHAPatientProfile
  );
  return data;
}
