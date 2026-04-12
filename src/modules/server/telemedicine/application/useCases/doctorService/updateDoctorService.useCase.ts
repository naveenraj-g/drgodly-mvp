import { getTelemedicineInjection } from "../../../di/container";
import {
  TService,
  TServiceUpdateForUseCase,
} from "../../../../../shared/entities/models/telemedicine/service";

export async function updateDoctorServiceUseCase(
  updateData: TServiceUpdateForUseCase
): Promise<TService> {
  const doctorServiceRepository = getTelemedicineInjection(
    "IDoctorServiceRepository"
  );
  const IdResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const { userId, ...rest } = updateData;

  const doctorId = await IdResolverRepository.resolveDoctorIdByUserIdAndOrgId(
    userId,
    rest.orgId
  );

  if (!doctorId) {
    throw new Error("Doctor not found");
  }

  const data = await doctorServiceRepository.updateDoctorService({
    ...rest,
    doctorId,
  });

  return data;
}
