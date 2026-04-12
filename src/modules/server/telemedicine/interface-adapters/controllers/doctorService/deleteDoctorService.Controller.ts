import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { DeleteDoctorServiceValidationSchema } from "../../../../../shared/schemas/telemedicine/doctorService/doctorServiceValidationSchema";
import { TService } from "../../../../../shared/entities/models/telemedicine/service";
import { deleteDoctorServiceUseCase } from "../../../application/useCases/doctorService/deleteDoctorService.useCase";

function presenter(data: TService) {
  return data;
}

export type TDeleteDoctorServiceControllerOutput = ReturnType<typeof presenter>;

export async function deleteDoctorServiceController(
  input: any
): Promise<TDeleteDoctorServiceControllerOutput> {
  const { data, error: inputParseError } =
    await DeleteDoctorServiceValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const { orgId, serviceId, userId } = data;

  const doctorServices = await deleteDoctorServiceUseCase(
    serviceId,
    userId,
    orgId
  );

  return presenter(doctorServices);
}
