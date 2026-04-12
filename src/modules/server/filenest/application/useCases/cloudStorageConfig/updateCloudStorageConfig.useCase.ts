import { getSharedInjection } from "../../../../shared/di/container";
import {
  TCloudStorageConfigSchema,
  TUpdateCloudStorage,
} from "../../../../../shared/entities/models/filenest/cloudStorage";
import { getFilenestInjection } from "../../../di/container";

export async function updateCloudStorageConfigUseCase(
  updateData: TUpdateCloudStorage
): Promise<TCloudStorageConfigSchema> {
  const userService = getSharedInjection("IUserService");
  const cloudStorageRepository = getFilenestInjection(
    "ICloudStorageRepository"
  );

  const isUserInOrg = await userService.isUserInOrg(
    updateData.userId,
    updateData.orgId
  );

  if (!isUserInOrg) {
    throw new Error("Access denied: the user must be part of the organization");
  }

  const data = cloudStorageRepository.updateCloudStorageConfig(updateData);
  return data;
}
