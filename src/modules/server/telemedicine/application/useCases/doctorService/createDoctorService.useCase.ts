import { getTelemedicineInjection } from "../../../di/container";
import {
  TService,
  TServiceCreateForUseCase,
} from "../../../../../shared/entities/models/telemedicine/service";

export async function createDoctorServiceUseCase(
  createData: TServiceCreateForUseCase
): Promise<TService> {
  const doctorServiceRepository = getTelemedicineInjection(
    "IDoctorServiceRepository"
  );
  const IdResolverRepository = getTelemedicineInjection(
    "IIdResolverRepository"
  );

  const { userId, ...rest } = createData;

  const doctorId = await IdResolverRepository.resolveDoctorIdByUserIdAndOrgId(
    userId,
    rest.orgId
  );

  if (!doctorId) {
    throw new Error("Doctor not found");
  }

  const data = await doctorServiceRepository.createDoctorService({
    ...rest,
    doctorId,
  });

  return data;
}
