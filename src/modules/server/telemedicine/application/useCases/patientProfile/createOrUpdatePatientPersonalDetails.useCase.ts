import {
  TPatientCreateOrUpdatePatientProfile,
  TPatientPersonalDetails,
} from "../../../../../shared/entities/models/telemedicine/patientProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createOrUpdatePatientPersonalDetailsUseCase(
  createOrUpdateData: TPatientCreateOrUpdatePatientProfile,
  fhirPatientId?: number
): Promise<TPatientPersonalDetails> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IPatientProfileRepository"
  );

  let data: TPatientPersonalDetails;

  if (createOrUpdateData.id) {
    data = await doctorProfileRepository.updatePatientPersonalDetails(
      createOrUpdateData,
      fhirPatientId
    );
  } else {
    data = await doctorProfileRepository.createPatientPersonalDetails(
      createOrUpdateData,
      fhirPatientId
    );
  }

  return data;
}
