import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { EditDoctorServiceValidationSchema as UpdateDoctorServiceValidationSchema } from "../../../../../shared/schemas/telemedicine/doctorService/doctorServiceValidationSchema";
import { TService } from "../../../../../shared/entities/models/telemedicine/service";
import { updateDoctorServiceUseCase } from "../../../application/useCases/doctorService/updateDoctorService.useCase";

function presenter(data: TService) {
  return data;
}

export type TUpdateDoctorServiceControllerOutput = ReturnType<typeof presenter>;

export async function updateDoctorServiceController(
  input: any
): Promise<TUpdateDoctorServiceControllerOutput> {
  const { data, error: inputParseError } =
    await UpdateDoctorServiceValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorServices = await updateDoctorServiceUseCase(data);

  return presenter(doctorServices);
}
