import { CreatePatientInitialProfileSchema } from "../../../../../shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { createPatientInitialProfileUseCase } from "../../../application/useCases/patientProfile/createPatientInitialProfile.useCase";
import { TPatientInitialProfile } from "../../../../../shared/entities/models/telemedicine/patientProfile";

function presenter(data: TPatientInitialProfile) {
  return data;
}

export type TCreatePatientInitialProfileOutput = ReturnType<typeof presenter>;

export async function createPatientInitialProfileController(
  input: any
): Promise<TCreatePatientInitialProfileOutput> {
  const { data, error: inputParseError } =
    await CreatePatientInitialProfileSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const patientInitialProfile = await createPatientInitialProfileUseCase(
    data.orgId,
    data.userId,
    data.createdBy,
    data.isABHAPatientProfile
  );

  return presenter(patientInitialProfile);
}
