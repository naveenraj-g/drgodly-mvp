import { getTelemedicineInjection } from "../../../di/container";
import { TServices } from "../../../../../shared/entities/models/telemedicine/service";

export async function getDoctorServiceUseCase(
  userId: string,
  orgId: string
): Promise<TServices> {
  const doctorServiceRepository = getTelemedicineInjection(
    "IDoctorServiceRepository"
  );
  const IdResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const doctorId = await IdResolverRepository.resolveDoctorIdByUserIdAndOrgId(
    userId,
    orgId
  );

  if (!doctorId) {
    throw new Error("Doctor not found");
  }

  const data = await doctorServiceRepository.getDoctorServices(doctorId, orgId);

  return data;
}
