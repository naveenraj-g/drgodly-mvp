import {
  TDoctor,
  TSubmitFullDoctorProfile,
} from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function submitDoctorFullProfileUseCase(
  data: TSubmitFullDoctorProfile
): Promise<TDoctor> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );

  return await doctorProfileRepository.submitDoctorFullProfile(data);
}
