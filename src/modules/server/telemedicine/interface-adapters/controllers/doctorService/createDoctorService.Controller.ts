import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { DoctorServiceValidationSchema as CreateDoctorServiceValidationSchema } from "../../../../../shared/schemas/telemedicine/doctorService/doctorServiceValidationSchema";
import { TService } from "../../../../../shared/entities/models/telemedicine/service";
import { createDoctorServiceUseCase } from "../../../application/useCases/doctorService/createDoctorService.useCase";

function presenter(data: TService) {
  return data;
}

export type TCreateDoctorServiceControllerOutput = ReturnType<typeof presenter>;

export async function CreateDoctorServiceController(
  input: any
): Promise<TCreateDoctorServiceControllerOutput> {
  const { data, error: inputParseError } =
    await CreateDoctorServiceValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const doctorServices = await createDoctorServiceUseCase(data);

  return presenter(doctorServices);
}
