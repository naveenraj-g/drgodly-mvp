import { DoctorConcentCreateOrUpdateValidation } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TDoctorConcent } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { createOrUpdateDoctorConcentUseCase } from "../../../application/useCases/doctorProfile/createOrUpdateDoctorConcent.useCase";

function presenter(data: TDoctorConcent) {
  return data;
}

export type TCreateOrUpdateDoctorConcentOutput = ReturnType<typeof presenter>;

export async function createorUpdateDoctorConcentController(
  input: any
): Promise<TCreateOrUpdateDoctorConcentOutput> {
  const { data, error: inputParseError } =
    await DoctorConcentCreateOrUpdateValidation.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorConcentData = await createOrUpdateDoctorConcentUseCase(data);

  return presenter(doctorConcentData);
}
