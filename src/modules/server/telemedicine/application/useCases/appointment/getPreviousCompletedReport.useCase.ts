import { getTelemedicineInjection } from "../../../di/container";

export async function getPreviousCompletedReportUseCase(
  patientUserId: string,
  orgId: string,
  excludeAppointmentId: string
): Promise<any> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  if (!orgId) throw new Error("Organization is required");

  const patientId = await idResolverRepository.resolvePatientIdByUserIdAndOrgId(
    patientUserId,
    orgId
  );

  if (!patientId) throw new Error("Patient not found");

  return appointmentRepository.getPreviousCompletedReport(
    patientId,
    orgId,
    excludeAppointmentId
  );
}
