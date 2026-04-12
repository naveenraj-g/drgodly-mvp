import { DoctorProfileCreateOrUpdateValidationSchema } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TDoctorPersonalDetails } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { createOrUpdateDoctorPersonalDetailsUseCase } from "../../../application/useCases/doctorProfile/createOrUpdateDoctorPersonalDetails.useCase";

function presenter(data: TDoctorPersonalDetails) {
  return data;
}

export type TCreateOrUpdateDoctorPersonalDetailsOutput = ReturnType<
  typeof presenter
>;

export async function createorUpdateDoctorPersonalDetailsController(
  input: any
): Promise<TCreateOrUpdateDoctorPersonalDetailsOutput> {
  const { data, error: inputParseError } =
    await DoctorProfileCreateOrUpdateValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorData = await createOrUpdateDoctorPersonalDetailsUseCase(data);

  return presenter(doctorData);
}
