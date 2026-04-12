import { getSharedInjection } from "../../../../../server/shared/di/container";
import {
  TLocalStorageConfigsSchema,
  TGetLocalStorageConfig,
} from "../../../../../shared/entities/models/filenest/localStorage";
import { getFilenestInjection } from "../../../di/container";

export async function getLocalStorageConfigsUseCase({
  userId,
  orgId,
}: TGetLocalStorageConfig & {
  userId: string;
}): Promise<TLocalStorageConfigsSchema> {
  const userService = getSharedInjection("IUserService");
  const localStorageRepository = getFilenestInjection(
    "ILocalStorageRepository"
  );

  const isUserInOrg = await userService.isUserInOrg(userId, orgId);
  if (!isUserInOrg) {
    throw new Error("Access denied: the user must be part of the organization");
  }

  const data = localStorageRepository.getLocalStorageConfigs({ orgId });
  return data;
}
