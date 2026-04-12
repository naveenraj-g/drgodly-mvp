import {
  TCreateOrUpdateDoctorProfileDetail,
  TDoctorPersonalDetails,
} from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createOrUpdateDoctorPersonalDetailsUseCase(
  createOrUpdateData: TCreateOrUpdateDoctorProfileDetail
): Promise<TDoctorPersonalDetails> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );

  let data: TDoctorPersonalDetails;

  if (createOrUpdateData.id) {
    data = await doctorProfileRepository.updateDoctorPersonalDetails(
      createOrUpdateData
    );
  } else {
    data = await doctorProfileRepository.createDoctorPersonalDetails(
      createOrUpdateData
    );
  }

  return data;
}
