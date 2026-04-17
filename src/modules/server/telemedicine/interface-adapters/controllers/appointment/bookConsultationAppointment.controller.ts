import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TIntakeAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { BookConsultationAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { bookConsultationAppointmentUseCase } from "../../../application/useCases/appointment/bookConsultationAppointment.useCase";

function presenter(data: TIntakeAppointment) {
  return data;
}

export type TBookConsultationAppointmentControllerOutput = ReturnType<
  typeof presenter
>;

export async function bookConsultationAppointmentController(
  input: any
): Promise<TBookConsultationAppointmentControllerOutput> {
  const { data, error: inputParseError } =
    await BookConsultationAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointment = await bookConsultationAppointmentUseCase(data);

  return presenter(appointment);
}
