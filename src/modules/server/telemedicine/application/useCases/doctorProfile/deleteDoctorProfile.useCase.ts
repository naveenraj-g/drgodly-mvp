import { TDoctorInitialProfile } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function deleteDoctorProfileUseCase(
  id: string
): Promise<TDoctorInitialProfile> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );
  const data = await doctorProfileRepository.deleteDoctorProfile(id);
  return data;
}
