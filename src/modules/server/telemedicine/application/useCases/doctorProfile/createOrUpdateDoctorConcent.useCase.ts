import {
  TCreateOrUpdateDoctorConcent,
  TDoctorConcent,
} from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getTelemedicineInjection } from "../../../di/container";

export async function createOrUpdateDoctorConcentUseCase(
  createOrUpdateData: TCreateOrUpdateDoctorConcent
): Promise<TDoctorConcent> {
  const doctorProfileRepository = getTelemedicineInjection(
    "IDoctorProfileRepository"
  );

  let data: TDoctorConcent;

  if (createOrUpdateData.id) {
    data = await doctorProfileRepository.updateDoctorConcent(
      createOrUpdateData
    );
  } else {
    data = await doctorProfileRepository.createDoctorConcent(
      createOrUpdateData
    );
  }

  return data;
}
