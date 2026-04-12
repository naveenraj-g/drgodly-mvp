import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { UpsertFullWeekValidationSchema } from "../../../../../shared/schemas/telemedicine/doctorWeeklyAvailability/doctorWeeklyAvailabilityValidationSchema";
import { TWeeklyAvailabilitiesPublic } from "../../../../../shared/entities/models/telemedicine/weeklyAvailability";
import { upsertDoctorWeeklyAvailabilityUseCase } from "../../../application/useCases/doctorWeeklyAvailability/upsertDoctorWeeklyAvailability.useCase";

function presenter(data: TWeeklyAvailabilitiesPublic) {
  return data;
}

export type TUpsertDoctorWeeklyAvailabilityControllerOutput = ReturnType<
  typeof presenter
>;

export async function upsertDoctorWeeklyAvailabilityController(
  input: any
): Promise<TUpsertDoctorWeeklyAvailabilityControllerOutput> {
  const { data, error: inputParseError } =
    await UpsertFullWeekValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const availabilitys = await upsertDoctorWeeklyAvailabilityUseCase(
    data.userId,
    data.orgId,
    data.payload
  );

  return presenter(availabilitys);
}
