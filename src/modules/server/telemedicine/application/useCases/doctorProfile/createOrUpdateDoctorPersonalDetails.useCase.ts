import {
  TCreateOrUpdateDoctorProfileDetail,
  TDoctorPersonalDetails,
} from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createOrUpdateDoctorPersonalDetailsUseCase(
  createOrUpdateData: TCreateOrUpdateDoctorProfileDetail,
  fhirPractitionerId?: number
): Promise<TDoctorPersonalDetails> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );

  let data: TDoctorPersonalDetails;

  if (createOrUpdateData.id) {
    data = await doctorProfileRepository.updateDoctorPersonalDetails(
      createOrUpdateData,
      fhirPractitionerId
    );
  } else {
    data = await doctorProfileRepository.createDoctorPersonalDetails(
      createOrUpdateData,
      fhirPractitionerId
    );
  }

  return data;
}
