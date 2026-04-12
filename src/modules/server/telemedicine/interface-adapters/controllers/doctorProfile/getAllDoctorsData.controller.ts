import { TDoctorDatas } from "../../../../../shared/entities/models/telemedicine/doctorProfile";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { getAllDoctorSchema } from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { getAllDoctorsDataUseCase } from "../../../application/useCases/doctorProfile/getAllDoctorsData.useCase";

function presenter(data: TDoctorDatas) {
  return data;
}

export type TGetAllDoctorsDataOutput = ReturnType<typeof presenter>;

export async function getAllDoctorsDataController(
  input: any
): Promise<TGetAllDoctorsDataOutput> {
  const { data, error: inputParseError } =
    await getAllDoctorSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorsData = await getAllDoctorsDataUseCase(data.orgId);
  return presenter(doctorsData);
}
