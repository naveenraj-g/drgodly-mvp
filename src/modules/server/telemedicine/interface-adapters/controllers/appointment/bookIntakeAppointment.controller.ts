import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TIntakeAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { BookIntakeAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { bookIntakeAppointmentUseCase } from "../../../application/useCases/appointment/bookIntakeAppointment.useCase";

function presenter(data: TIntakeAppointment) {
  return data;
}

export type TBookIntakeAppointmentControllerOutput = ReturnType<
  typeof presenter
>;

export async function bookIntakeAppointmentController(
  input: any
): Promise<TBookIntakeAppointmentControllerOutput> {
  const { data, error: inputParseError } =
    await BookIntakeAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointement = await bookIntakeAppointmentUseCase(data);

  return presenter(appointement);
}
