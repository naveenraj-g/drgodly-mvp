import { getTelemedicineInjection } from "../../../di/container";

export async function getDoctorProfileByHPRIdUseCase(
  hprId: string
): Promise<any> {
  const doctorProfileRepository = getTelemedicineInjection("IABDMService");
  const data = await doctorProfileRepository.getDoctorProfileByHPRId(hprId);
  return data;
}
