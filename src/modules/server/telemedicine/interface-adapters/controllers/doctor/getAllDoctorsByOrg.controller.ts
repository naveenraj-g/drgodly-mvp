import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { GetDoctorsByOrgSchema } from "../../../../../shared/schemas/telemedicine/doctor/doctorValidationSchema";
import { getDoctorsByOrgUseCase } from "../../../application/useCases/doctor/getDoctorsByOrg.useCase";
import { TDoctorsList } from "../../../../../shared/entities/models/telemedicine/doctor-list";

function presenter(data: TDoctorsList) {
  return data;
}

export type TGetDoctorsByOrgOutput = ReturnType<typeof presenter>;

export async function getDoctorsByOrgController(
  input: any
): Promise<TGetDoctorsByOrgOutput> {
  const { data, error: inputParseError } =
    await GetDoctorsByOrgSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorsData = await getDoctorsByOrgUseCase(data.orgId);
  return presenter(doctorsData);
}
