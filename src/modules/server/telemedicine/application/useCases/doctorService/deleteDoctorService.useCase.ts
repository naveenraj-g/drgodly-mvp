import { getTelemedicineInjection } from "../../../di/container";
import { TService } from "../../../../../shared/entities/models/telemedicine/service";

export async function deleteDoctorServiceUseCase(
  serviceId: string,
  userId: string,
  orgId: string
): Promise<TService> {
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

  const data = await doctorServiceRepository.deleteDoctorService(
    serviceId,
    doctorId,
    orgId
  );

  return data;
}
