import { getDashboardAppointmentsDataValidationSchema } from "../../../../../shared/schemas/telemedicine/dashboard/dashboardValidationSchema";
import {
  getDashboardAppointmentsDataUseCase,
  TGetDashboardAppointmentsDataUseCaseReturnType,
} from "../../../application/useCases/dashboard/getDashboardAppointmentsData.useCase";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";

function presenter(data: TGetDashboardAppointmentsDataUseCaseReturnType) {
  return data;
}

export type TGetDashboardAppointmentsDataControllerOutput = ReturnType<
  typeof presenter
>;

export async function getDashboardAppointmentsDataController(
  input: any
): Promise<TGetDashboardAppointmentsDataControllerOutput> {
  const { data, error: inputParseError } =
    await getDashboardAppointmentsDataValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const appointmentData = await getDashboardAppointmentsDataUseCase(data);

  return presenter(appointmentData);
}
