import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { getPreviousCompletedReportUseCase } from "../../../application/useCases/appointment/getPreviousCompletedReport.useCase";
import z from "zod";

const InputSchema = z.object({
  patientUserId: z.string().min(1),
  orgId: z.string().min(1),
  excludeAppointmentId: z.string().min(1),
});

function presenter(data: any) {
  return data;
}

export type TGetPreviousCompletedReportControllerOutput = ReturnType<
  typeof presenter
>;

export async function getPreviousCompletedReportController(
  input: any
): Promise<TGetPreviousCompletedReportControllerOutput> {
  const { data, error: inputParseError } =
    await InputSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const report = await getPreviousCompletedReportUseCase(
    data.patientUserId,
    data.orgId,
    data.excludeAppointmentId
  );

  return presenter(report);
}
