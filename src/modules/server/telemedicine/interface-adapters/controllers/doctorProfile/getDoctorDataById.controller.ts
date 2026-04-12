import { DeleteDoctorProfileSchema as GetDoctorProfileSchema } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TDoctor } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getDoctorDataByIdUseCase } from "../../../application/useCases/doctorProfile/getDoctorDataById.useCase";

function presenter(data: TDoctor | null) {
  return data;
}

export type TGetDoctorDataByIdOutput = ReturnType<typeof presenter>;

export async function getDoctorDataByIdController(
  input: any
): Promise<TGetDoctorDataByIdOutput> {
  const { data, error: inputParseError } =
    await GetDoctorProfileSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorData = await getDoctorDataByIdUseCase(data.id);

  return presenter(doctorData);
}
