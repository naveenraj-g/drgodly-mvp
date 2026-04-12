import { TDoctorDatas } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function getAllDoctorsDataUseCase(
  orgId: string
): Promise<TDoctorDatas> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );
  const data = await doctorProfileRepository.getAllDoctorsData(orgId);
  return data;
}
