import { SubmitDoctorFullProfileValidationSchema } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TDoctor } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { submitDoctorFullProfileUseCase } from "../../../application/useCases/doctorProfile/submitDoctorFullProfile.useCase";

function presenter(data: TDoctor) {
  return data;
}

export type TSubmitDoctorFullProfileOutput = ReturnType<typeof presenter>;

export async function submitDoctorFullProfileController(
  input: any
): Promise<TSubmitDoctorFullProfileOutput> {
  const { data, error: inputParseError } =
    await SubmitDoctorFullProfileValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorConcentData = await submitDoctorFullProfileUseCase(data);

  return presenter(doctorConcentData);
}
