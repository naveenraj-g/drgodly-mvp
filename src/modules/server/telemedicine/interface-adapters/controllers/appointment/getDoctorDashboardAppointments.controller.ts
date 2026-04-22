import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { TAppointments } from "../../../../../shared/entities/models/telemedicine/appointment";
import { GetAppointmentValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { getDoctorDashboardAppointmentsUseCase } from "../../../application/useCases/appointment/getDoctorDashboardAppointments.useCase";

function presenter(data: TAppointments) {
  return data;
}

export type TGetDoctorDashboardAppointmentsControllerOutput = ReturnType<
  typeof presenter
>;

export async function getDoctorDashboardAppointmentsController(
  input: any
): Promise<TGetDoctorDashboardAppointmentsControllerOutput> {
  const { data, error: inputParseError } =
    await GetAppointmentValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointments = await getDoctorDashboardAppointmentsUseCase(
    data.userId,
    data.orgId
  );

  return presenter(appointments);
}
