import { TDoctor } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function getDoctorDataByIdUseCase(
  id: string
): Promise<TDoctor | null> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );
  const data = await doctorProfileRepository.getDoctorDataById(id);
  return data;
}
