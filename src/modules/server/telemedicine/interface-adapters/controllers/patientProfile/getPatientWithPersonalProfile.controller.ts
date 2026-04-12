import { GetPatientWithPersonalProfileSchema } from "../../../../../shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TPatientWithPersonalProfile } from "../../../../../shared/entities/models/telemedicine/patientProfile";
import { getPatientWithPersonalProfileUseCase } from "../../../application/useCases/patientProfile/getPatientWithPersonalProfile.useCase";

function presenter(data: TPatientWithPersonalProfile | null) {
  return data;
}

export type TGetPatientWithPersonalProfileOutput = ReturnType<typeof presenter>;

export async function getPatientWithPersonalProfileController(
  input: any
): Promise<TGetPatientWithPersonalProfileOutput> {
  const { data, error: inputParseError } =
    await GetPatientWithPersonalProfileSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const patientInitialProfile = await getPatientWithPersonalProfileUseCase(
    data.orgId,
    data.userId
  );

  return presenter(patientInitialProfile);
}
