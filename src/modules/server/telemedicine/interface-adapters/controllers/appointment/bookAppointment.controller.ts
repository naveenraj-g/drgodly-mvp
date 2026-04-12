import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { BookAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { bookAppointmentUseCase } from "../../../application/useCases/appointment/bookAppointment.useCase";

function presenter(data: TAppointment) {
  return data;
}

export type TBookAppointmentControllerOutput = ReturnType<typeof presenter>;

export async function bookAppointmentController(
  input: any
): Promise<TBookAppointmentControllerOutput> {
  const { data, error: inputParseError } =
    await BookAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointement = await bookAppointmentUseCase(data);

  return presenter(appointement);
}
