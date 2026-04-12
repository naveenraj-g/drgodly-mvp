import { getSharedInjection } from "../../../../shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TGetUserFilePermissionsByOwner,
  TUserFilePermissionsSchema,
} from "../../../../../shared/entities/models/filenest/userFilePermission";

export async function getUserFilePermissionsByOwnerUseCase(
  data: TGetUserFilePermissionsByOwner
): Promise<TUserFilePermissionsSchema> {
  const userService = getSharedInjection("IUserService");
  const userFilePermissionRepository = getFilenestInjection(
    "IUserFilePermissionRepository"
  );

  const isUserInOrg = await userService.isUserInOrg(data.userId, data.orgId);

  if (!isUserInOrg) {
    throw new Error("Access denied: user is not part of the organization");
  }

  return userFilePermissionRepository.getUserFilePermissionsByOwner(data);
}
