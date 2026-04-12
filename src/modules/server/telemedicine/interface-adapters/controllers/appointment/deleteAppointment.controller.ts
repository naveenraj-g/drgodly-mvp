import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { DeleteAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { deleteAppointmentUseCase } from "../../../application/useCases/appointment/deleteAppointment.useCase";

function presenter(data: string) {
  return data;
}

export type TDeleteAppointmentControllerOutput = ReturnType<typeof presenter>;

export async function deleteAppointmentController(
  input: any
): Promise<TDeleteAppointmentControllerOutput> {
  const { data, error: inputParseError } =
    await DeleteAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const { appointmentId, orgId, userId } = data;

  const appointement = await deleteAppointmentUseCase(
    appointmentId,
    orgId,
    userId
  );

  return presenter(appointement);
}
