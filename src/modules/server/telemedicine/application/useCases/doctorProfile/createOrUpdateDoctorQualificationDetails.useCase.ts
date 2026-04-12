import {
  TCreateOrUpdateDoctorQualificationDetail,
  TDoctorQualifications,
} from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createOrUpdateDoctorQualificationDetailsUseCase(
  createOrUpdateData: TCreateOrUpdateDoctorQualificationDetail
): Promise<TDoctorQualifications> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );

  let data: TDoctorQualifications;

  if (createOrUpdateData.id) {
    data = await doctorProfileRepository.updateDoctorQualificationDetails(
      createOrUpdateData
    );
  } else {
    data = await doctorProfileRepository.createDoctorQualificationDetails(
      createOrUpdateData
    );
  }

  return data;
}
