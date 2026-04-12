import { TAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { CancelAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { cancelAppointmentUseCase } from "../../../application/useCases/appointment/cancelAppointment.useCase";

function presenter(data: TAppointment) {
  return data;
}

export type TCancelAppointmentControllerOutput = ReturnType<typeof presenter>;

export async function cancelAppointmentController(
  input: any
): Promise<TCancelAppointmentControllerOutput> {
  const { data, error: inputParseError } =
    await CancelAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointement = await cancelAppointmentUseCase(data);

  return presenter(appointement);
}
