import { PatientProfileCreateOrUpdateValidationSchema } from "../../../../../shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TPatientPersonalDetails } from "../../../../../shared/entities/models/telemedicine/patientProfile";
import { createOrUpdatePatientPersonalDetailsUseCase } from "../../../application/useCases/patientProfile/createOrUpdatePatientPersonalDetails.useCase";

function presenter(data: TPatientPersonalDetails) {
  return data;
}

export type TCreateOrUpdatePatientPersonalDetailsOutput = ReturnType<
  typeof presenter
>;

export async function createorUpdatePatientPersonalDetailsController(
  input: any
): Promise<TCreateOrUpdatePatientPersonalDetailsOutput> {
  const { data, error: inputParseError } =
    await PatientProfileCreateOrUpdateValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const patientData = await createOrUpdatePatientPersonalDetailsUseCase(data);

  return presenter(patientData);
}
