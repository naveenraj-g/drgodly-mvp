import { TAppointments } from "@/modules/shared/entities/models/telemedicine/appointment";
import { getTelemedicineInjection } from "../../../di/container";

export async function getAppointmentsForPatientUseCase(
  userId: string,
  orgId: string
): Promise<TAppointments> {
  const appointmentRepository = getTelemedicineInjection(
    "IAppointmentRepository"
  );
  const idResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const patientId = await idResolverRepository.resolvePatientIdByUserIdAndOrgId(
    userId,
    orgId
  );

  if (!patientId) {
    throw new Error("Patient not found");
  }

  const data = await appointmentRepository.getAppointmentsForPatient(
    patientId,
    orgId
  );

  return data;
}
