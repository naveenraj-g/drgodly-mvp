import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TAppointments } from "../../../../../shared/entities/models/telemedicine/appointment";
import { GetAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { getAppointmentsForDoctorUseCase } from "../../../application/useCases/appointment/getAppointmentForDoctor.useCase";

function presenter(data: TAppointments) {
  return data;
}

export type TGetAppointmentsForDoctorControllerOutput = ReturnType<
  typeof presenter
>;

export async function getAppointmentsForDoctorController(
  input: any
): Promise<TGetAppointmentsForDoctorControllerOutput> {
  const { data, error: inputParseError } =
    await GetAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointement = await getAppointmentsForDoctorUseCase(
    data.userId,
    data.orgId
  );

  return presenter(appointement);
}
