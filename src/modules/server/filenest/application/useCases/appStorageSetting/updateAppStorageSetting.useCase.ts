import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TAppStorageSettingSchema,
  TUpdateAppStorageSetting,
} from "../../../../../shared/entities/models/filenest/appStorageSettings";

export async function updateAppStorageSettingUseCase(
  input: TUpdateAppStorageSetting
): Promise<TAppStorageSettingSchema> {
  const userService = getSharedInjection("IUserService");
  const appStorageRepository = getFilenestInjection(
    "IAppStorageSettingRepository"
  );

  const isUserInOrg = await userService.isUserInOrg(
    input.userId,
    input.orgId
  );
  if (!isUserInOrg)
    throw new Error("Access denied: the user must be part of the organization");

  return appStorageRepository.updateAppStorageSetting(input);
}
