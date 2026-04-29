import { TAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { CompleteConsultationValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { completeConsultationUseCase } from "../../../application/useCases/appointment/completeConsultation.useCase";

function presenter(data: TAppointment) {
  return data;
}

export type TCompleteConsultationControllerOutput = ReturnType<
  typeof presenter
>;

export async function completeConsultationController(
  input: any
): Promise<TCompleteConsultationControllerOutput> {
  const { data, error: inputParseError } =
    await CompleteConsultationValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointment = await completeConsultationUseCase(data);

  return presenter(appointment);
}
