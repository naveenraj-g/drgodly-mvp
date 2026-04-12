import { DeleteDoctorProfileSchema } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { deleteDoctorProfileUseCase } from "../../../application/useCases/doctorProfile/deleteDoctorProfile.useCase";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TDoctorInitialProfile } from "../../../../../shared/entities/models/telemedicine/doctorProfile";

function presenter(data: TDoctorInitialProfile) {
  return data;
}

export type TDeleteDoctorProfileOutput = ReturnType<typeof presenter>;

export async function deleteDoctorProfileController(
  input: any
): Promise<TDeleteDoctorProfileOutput> {
  const { data, error: inputParseError } =
    await DeleteDoctorProfileSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorInitialProfile = await deleteDoctorProfileUseCase(data.id);

  return presenter(doctorInitialProfile);
}
