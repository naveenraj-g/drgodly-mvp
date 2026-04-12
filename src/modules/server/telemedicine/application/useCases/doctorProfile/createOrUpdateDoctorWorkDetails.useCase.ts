import {
  TCreateOrUpdateDoctorWorkDetail,
  TDoctorWorkDetails,
} from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createOrUpdateDoctorWorkDetailsUseCase(
  createOrUpdateData: TCreateOrUpdateDoctorWorkDetail
): Promise<TDoctorWorkDetails> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );

  let data: TDoctorWorkDetails;

  if (createOrUpdateData.id) {
    data = await doctorProfileRepository.updateDoctorWorkDetails(
      createOrUpdateData
    );
  } else {
    data = await doctorProfileRepository.createDoctorWorkDetails(
      createOrUpdateData
    );
  }

  return data;
}
