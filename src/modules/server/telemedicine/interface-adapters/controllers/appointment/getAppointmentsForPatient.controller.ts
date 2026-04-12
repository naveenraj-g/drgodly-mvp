import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TAppointments } from "../../../../../shared/entities/models/telemedicine/appointment";
import { GetAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { getAppointmentsForPatientUseCase } from "../../../application/useCases/appointment/getAppointmentForPatient.useCase";

function presenter(data: TAppointments) {
  return data;
}

export type TGetAppointmentsForPatientControllerOutput = ReturnType<
  typeof presenter
>;

export async function getAppointmentsForPatientController(
  input: any
): Promise<TGetAppointmentsForPatientControllerOutput> {
  const { data, error: inputParseError } =
    await GetAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointement = await getAppointmentsForPatientUseCase(
    data.userId,
    data.orgId
  );

  return presenter(appointement);
}
