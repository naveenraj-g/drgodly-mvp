import { DoctorWorkDetailCreateOrUpdateValidation } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TDoctorWorkDetails } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { createOrUpdateDoctorWorkDetailsUseCase } from "../../../application/useCases/doctorProfile/createOrUpdateDoctorWorkDetails.useCase";

function presenter(data: TDoctorWorkDetails) {
  return data;
}

export type TCreateOrUpdateDoctorWorkDetailsOutput = ReturnType<
  typeof presenter
>;

export async function createorUpdateDoctorWorkDetailsController(
  input: any
): Promise<TCreateOrUpdateDoctorWorkDetailsOutput> {
  const { data, error: inputParseError } =
    await DoctorWorkDetailCreateOrUpdateValidation.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorData = await createOrUpdateDoctorWorkDetailsUseCase(data);

  return presenter(doctorData);
}
