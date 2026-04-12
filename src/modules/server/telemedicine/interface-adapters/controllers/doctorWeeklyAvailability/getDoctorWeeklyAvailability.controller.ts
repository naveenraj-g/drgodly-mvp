import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { GetDoctorWeeklyAvailabilityValidationSchema } from "../../../../../shared/schemas/telemedicine/doctorWeeklyAvailability/doctorWeeklyAvailabilityValidationSchema";
import { getDoctorWeeklyAvailabilityUseCase } from "../../../application/useCases/doctorWeeklyAvailability/getDoctorWeeklyAvailability.useCase";
import { TWeeklyAvailabilitiesPublic } from "../../../../../shared/entities/models/telemedicine/weeklyAvailability";

function presenter(data: TWeeklyAvailabilitiesPublic) {
  return data;
}

export type TGetDoctorWeeklyAvailabilityControllerOutput = ReturnType<
  typeof presenter
>;

export async function getDoctorWeeklyAvailabilityController(
  input: any
): Promise<TGetDoctorWeeklyAvailabilityControllerOutput> {
  const { data, error: inputParseError } =
    await GetDoctorWeeklyAvailabilityValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const availabilitys = await getDoctorWeeklyAvailabilityUseCase(
    data.userId,
    data.orgId
  );

  return presenter(availabilitys);
}
