import { getSharedInjection } from "../../../../../server/shared/di/container";
import {
  TLocalStorageConfigSchema,
  TCreateLocalStorage,
} from "../../../../../shared/entities/models/filenest/localStorage";
import { getFilenestInjection } from "../../../di/container";

export async function createLocalStorageConfigUseCase(
  createData: TCreateLocalStorage
): Promise<TLocalStorageConfigSchema> {
  const userService = getSharedInjection("IUserService");
  const localStorageRepository = getFilenestInjection(
    "ILocalStorageRepository"
  );

  const isUserInOrg = await userService.isUserInOrg(
    createData.userId,
    createData.orgId
  );
  if (!isUserInOrg) {
    throw new Error("Access denied: the user must be part of the organization");
  }

  const data = localStorageRepository.createLocalStorageConfig(createData);
  return data;
}
