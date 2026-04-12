import { getSharedInjection } from "../../../../shared/di/container";
import {
  TCloudStorageConfigSchema,
  TCreateCloudStorage,
} from "../../../../../shared/entities/models/filenest/cloudStorage";
import { getFilenestInjection } from "../../../di/container";

export async function createCloudStorageConfigUseCase(
  createDate: TCreateCloudStorage
): Promise<TCloudStorageConfigSchema> {
  const userService = getSharedInjection("IUserService");
  const cloudStorageRepository = getFilenestInjection(
    "ICloudStorageRepository"
  );

  const isUserInOrg = await userService.isUserInOrg(
    createDate.userId,
    createDate.orgId
  );

  if (!isUserInOrg) {
    throw new Error("Access denied: the user must be part of the organization");
  }

  const data = cloudStorageRepository.createCloudStorageConfig(createDate);
  return data;
}
