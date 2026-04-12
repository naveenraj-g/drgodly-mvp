import { getTelemedicineInjection } from "../../../di/container";
import { TDoctorsList } from "../../../../../shared/entities/models/telemedicine/doctor-list";

export async function getDoctorsByOrgUseCase(
  orgId: string
): Promise<TDoctorsList> {
  const doctorRepository = getTelemedicineInjection("IDoctorRepository");

  const data = await doctorRepository.getDoctorsByOrg(orgId);

  return data;
}
