import { CreateDoctorByHPRidSchema } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { getDoctorProfileByHPRIdUseCase } from "../../../application/useCases/doctorProfile/getDoctorProfileByHPRId.useCase";

function presenter(data: any) {
  return data;
}

export type TGetDoctorProfileByHPRIdOutput = ReturnType<typeof presenter>;

export async function getDoctorProfileByHPRIdController(
  input: any
): Promise<TGetDoctorProfileByHPRIdOutput> {
  const { data, error: inputParseError } =
    await CreateDoctorByHPRidSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorInitialProfile = await getDoctorProfileByHPRIdUseCase(data.id);

  return presenter(doctorInitialProfile);
}
