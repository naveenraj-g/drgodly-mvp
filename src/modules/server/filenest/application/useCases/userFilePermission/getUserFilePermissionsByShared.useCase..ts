import { getSharedInjection } from "../../../../shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TGetUserFilePermissionsByShared,
  TUserFilePermissionsSchema,
} from "../../../../../shared/entities/models/filenest/userFilePermission";

export async function getUserFilePermissionsBySharedUseCase(
  data: TGetUserFilePermissionsByShared
): Promise<TUserFilePermissionsSchema> {
  const userService = getSharedInjection("IUserService");
  const userFilePermissionRepository = getFilenestInjection(
    "IUserFilePermissionRepository"
  );

  const isUserInOrg = await userService.isUserInOrg(data.userId, data.orgId);

  if (!isUserInOrg) {
    throw new Error("Access denied: user is not part of the organization");
  }

  return userFilePermissionRepository.getUserFilePermissionsByShared(data);
}
