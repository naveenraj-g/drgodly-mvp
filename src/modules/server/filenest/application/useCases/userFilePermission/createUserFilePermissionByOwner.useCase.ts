import { getSharedInjection } from "../../../../shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TCreateUserFilePermissionByOwner,
  TUserFilePermissionSchema,
} from "../../../../../shared/entities/models/filenest/userFilePermission";

export async function createUserFilePermissionByOwnerUseCase(
  createData: Omit<TCreateUserFilePermissionByOwner, "ownerUserId">
): Promise<TUserFilePermissionSchema> {
  const userService = getSharedInjection("IUserService");
  const userFilePermissionRepository = getFilenestInjection(
    "IUserFilePermissionRepository"
  );
  const filenestRepository = getFilenestInjection("IFilenestRepository");

  const { userId, orgId, sharedUserId, userFileId } = createData;

  const isUserInOrg = await userService.isUserInOrg(userId, orgId);
  if (!isUserInOrg) {
    throw new Error("Access denied: user is not part of the organization");
  }

  if (userId === sharedUserId) {
    throw new Error("You cannot share a file with yourself");
  }

  const isFileOwner = await filenestRepository.checkFileOwnerByUserIdAndOrgId(
    userId,
    orgId,
    userFileId
  );

  if (!isFileOwner) {
    throw new Error("Access denied: user does not own the file");
  }

  const isSharedUserInOrg = await userService.isUserInOrg(
    sharedUserId,
    orgId
  );

  if (!isSharedUserInOrg) {
    throw new Error(
      "Access denied: shared user is not part of the organization"
    );
  }

  if (!createData.canView && !createData.canDownload) {
    throw new Error("At least one permission must be enabled");
  }

  return userFilePermissionRepository.createUserFilePermissionByOwner({
    ...createData,
    ownerUserId: userId,
  });
}
