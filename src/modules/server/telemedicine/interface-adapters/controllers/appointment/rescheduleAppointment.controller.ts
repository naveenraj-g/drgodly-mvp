import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { RescheduleAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { rescheduleAppointmentUseCase } from "../../../application/useCases/appointment/rescheduleAppointment.useCase";

function presenter(data: TAppointment) {
  return data;
}

export type TRescheduleAppointmentControllerOutput = ReturnType<
  typeof presenter
>;

export async function rescheduleAppointmentController(
  input: any
): Promise<TRescheduleAppointmentControllerOutput> {
  const { data, error: inputParseError } =
    await RescheduleAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointement = await rescheduleAppointmentUseCase(data);

  return presenter(appointement);
}
