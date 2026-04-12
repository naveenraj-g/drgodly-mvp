import { CreateDoctorInitialProfileSchema } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { createDoctorInitialProfileUseCase } from "../../../application/useCases/doctorProfile/createDoctorInitialProfile.useCase";
import { TDoctorInitialProfile } from "../../../../../shared/entities/models/telemedicine/doctorProfile";

function presenter(data: TDoctorInitialProfile) {
  return data;
}

export type TCreateDoctorInitialProfileOutput = ReturnType<typeof presenter>;

export async function createDoctorInitialProfileController(
  input: any
): Promise<TCreateDoctorInitialProfileOutput> {
  const { data, error: inputParseError } =
    await CreateDoctorInitialProfileSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorInitialProfile = await createDoctorInitialProfileUseCase(
    data.orgId,
    data.createdBy,
    data.isABDMDoctorProfile
  );

  return presenter(doctorInitialProfile);
}
