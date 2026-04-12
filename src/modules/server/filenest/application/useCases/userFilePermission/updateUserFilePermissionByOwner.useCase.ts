import { getSharedInjection } from "../../../../shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TUpdateUserFilePermissionByOwner,
  TUserFilePermissionSchema,
} from "../../../../../shared/entities/models/filenest/userFilePermission";

export async function updateUserFilePermissionByOwnerUseCase(
  updateData: Omit<TUpdateUserFilePermissionByOwner, "ownerUserId">
): Promise<TUserFilePermissionSchema> {
  const userService = getSharedInjection("IUserService");
  const userFilePermissionRepository = getFilenestInjection(
    "IUserFilePermissionRepository"
  );
  const filenestRepository = getFilenestInjection("IFilenestRepository");

  const isUserInOrg = await userService.isUserInOrg(
    updateData.userId,
    updateData.orgId
  );
  if (!isUserInOrg) {
    throw new Error("Access denied: user is not part of the organization");
  }

  if (updateData.userId === updateData.sharedUserId) {
    throw new Error("You cannot share a file with yourself");
  }

  const isFileOwner = await filenestRepository.checkFileOwnerByUserIdAndOrgId(
    updateData.userId,
    updateData.orgId,
    updateData.userFileId
  );

  if (!isFileOwner) {
    throw new Error("Access denied: user does not own the file");
  }

  const isSharedUserInOrg = await userService.isUserInOrg(
    updateData.sharedUserId,
    updateData.orgId
  );

  if (!isSharedUserInOrg) {
    throw new Error(
      "Access denied: shared user is not part of the organization"
    );
  }

  if (!updateData.canView && !updateData.canDownload) {
    throw new Error("At least one permission must be enabled");
  }

  return userFilePermissionRepository.updateUserFilePermissionByOwner({
    ...updateData,
    ownerUserId: updateData.userId,
  });
}
