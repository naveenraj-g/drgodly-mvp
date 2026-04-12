import { DoctorQualificationCreateOrUpdateValidation } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TDoctorQualifications } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { createOrUpdateDoctorQualificationDetailsUseCase } from "../../../application/useCases/doctorProfile/createOrUpdateDoctorQualificationDetails.useCase";

function presenter(data: TDoctorQualifications) {
  return data;
}

export type TCreateOrUpdateDoctorQualificationDetailsOutput = ReturnType<
  typeof presenter
>;

export async function createorUpdateDoctorQualificationDetailsController(
  input: any
): Promise<TCreateOrUpdateDoctorQualificationDetailsOutput> {
  const { data, error: inputParseError } =
    await DoctorQualificationCreateOrUpdateValidation.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorData = await createOrUpdateDoctorQualificationDetailsUseCase(
    data
  );

  return presenter(doctorData);
}
