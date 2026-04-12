import { TAppointment } from "../../../../../shared/entities/models/telemedicine/appointment";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { DeleteAppointmentValidationSchema as GetAppointmentForOnlineConsultationValidationSchema } from "../../../../../shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { getAppointmentForOnlineConsultationUseCase } from "../../../application/useCases/appointment/getAppointmentForOnlineConsultation.useCase";

function presenter(data: TAppointment) {
  return data;
}

export type TGetAppointmentForOnlineConsultationControllerOutput = ReturnType<
  typeof presenter
>;

export async function getAppointmentForOnlineConsultationController(
  input: any
): Promise<TGetAppointmentForOnlineConsultationControllerOutput> {
  const { data, error: inputParseError } =
    await GetAppointmentForOnlineConsultationValidationSchema.safeParseAsync(
      input
    );

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointement = await getAppointmentForOnlineConsultationUseCase(
    data.appointmentId,
    data.orgId,
    data.userId
  );

  return presenter(appointement);
}
