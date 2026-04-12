import { getSharedInjection } from "../../../../shared/di/container";
import {
  TCloudStorageConfigSchema,
  TDeleteCloudStorage,
} from "../../../../../shared/entities/models/filenest/cloudStorage";
import { getFilenestInjection } from "../../../di/container";

export async function deleteCloudStorageConfigUseCase(
  deleteData: TDeleteCloudStorage & { userId: string }
): Promise<TCloudStorageConfigSchema> {
  const userService = getSharedInjection("IUserService");
  const cloudStorageRepository = getFilenestInjection(
    "ICloudStorageRepository"
  );

  const { id, orgId, userId } = deleteData;

  const isUserInOrg = await userService.isUserInOrg(userId, orgId);

  if (!isUserInOrg) {
    throw new Error("Access denied: the user must be part of the organization");
  }

  const data = cloudStorageRepository.deleteCloudStorageConfig({ id, orgId });
  return data;
}
