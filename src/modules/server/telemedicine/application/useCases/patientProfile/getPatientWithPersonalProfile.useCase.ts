import { TPatientWithPersonalProfile } from "../../../../../shared/entities/models/telemedicine/patientProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function getPatientWithPersonalProfileUseCase(
  orgId: string,
  userId: string
): Promise<TPatientWithPersonalProfile | null> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IPatientProfileRepository"
  );
  const data = await doctorProfileRepository.getPatientWithPersonalProfile(
    orgId,
    userId
  );
  return data;
}
