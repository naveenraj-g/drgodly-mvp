import { GetDoctorByUserIdSchema } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TDoctor } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { getDoctorDataByUserIdUseCase } from "../../../application/useCases/doctorProfile/getDoctorDataByUserId.useCase";

function presenter(data: TDoctor | null) {
  return data;
}

export type TGetDoctorDataByUserIdOutput = ReturnType<typeof presenter>;

export async function getDoctorDataByUserIdController(
  input: any
): Promise<TGetDoctorDataByUserIdOutput> {
  const { data, error: inputParseError } =
    await GetDoctorByUserIdSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorData = await getDoctorDataByUserIdUseCase(
    data.userId,
    data.orgId
  );

  return presenter(doctorData);
}
