import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { GetDoctorServiceValidationSchema } from "../../../../../shared/schemas/telemedicine/doctorService/doctorServiceValidationSchema";
import { TServices } from "../../../../../shared/entities/models/telemedicine/service";
import { getDoctorServiceUseCase } from "../../../application/useCases/doctorService/getDoctorServices.useCase";

function presenter(data: TServices) {
  return data;
}

export type TGetDoctorServiceControllerOutput = ReturnType<typeof presenter>;

export async function getDoctorServiceController(
  input: any
): Promise<TGetDoctorServiceControllerOutput> {
  const { data, error: inputParseError } =
    await GetDoctorServiceValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorServices = await getDoctorServiceUseCase(data.userId, data.orgId);

  return presenter(doctorServices);
}
