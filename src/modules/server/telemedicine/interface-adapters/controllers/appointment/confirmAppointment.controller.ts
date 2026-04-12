import { TAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { DeleteAppointmentValidationSchema as ConfirmedAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { confirmAppointmentUseCase } from "../../../application/useCases/appointment/confirmAppointment.useCase";

function presenter(data: TAppointment) {
  return data;
}

export type TConfirmAppointmentControllerOutput = ReturnType<typeof presenter>;

export async function confirmAppointmentController(
  input: any
): Promise<TConfirmAppointmentControllerOutput> {
  const { data, error: inputParseError } =
    await ConfirmedAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointement = await confirmAppointmentUseCase(data);

  return presenter(appointement);
}
