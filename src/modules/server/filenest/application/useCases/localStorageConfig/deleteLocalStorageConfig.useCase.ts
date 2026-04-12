import { getSharedInjection } from "../../../../../server/shared/di/container";
import {
  TLocalStorageConfigSchema,
  TDeleteLocalStorage,
} from "../../../../../shared/entities/models/filenest/localStorage";
import { getFilenestInjection } from "../../../di/container";

export async function deleteLocalStorageConfigUseCase(
  deleteData: TDeleteLocalStorage & { userId: string }
): Promise<TLocalStorageConfigSchema> {
  const userService = getSharedInjection("IUserService");
  const localStorageRepository = getFilenestInjection(
    "ILocalStorageRepository"
  );

  const { id, orgId, userId } = deleteData;

  const isUserInOrg = await userService.isUserInOrg(userId, orgId);
  if (!isUserInOrg) {
    throw new Error("Access denied: the user must be part of the organization");
  }

  const data = localStorageRepository.deleteLocalStorageConfig({ id, orgId });
  return data;
}
