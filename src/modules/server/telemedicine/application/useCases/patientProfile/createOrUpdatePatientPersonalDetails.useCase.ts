import {
  TPatientCreateOrUpdatePatientProfile,
  TPatientPersonalDetails,
} from "../../../../../shared/entities/models/telemedicine/patientProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createOrUpdatePatientPersonalDetailsUseCase(
  createOrUpdateData: TPatientCreateOrUpdatePatientProfile
): Promise<TPatientPersonalDetails> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IPatientProfileRepository"
  );

  let data: TPatientPersonalDetails;

  if (createOrUpdateData.id) {
    data = await doctorProfileRepository.updatePatientPersonalDetails(
      createOrUpdateData
    );
  } else {
    data = await doctorProfileRepository.createPatientPersonalDetails(
      createOrUpdateData
    );
  }

  return data;
}
