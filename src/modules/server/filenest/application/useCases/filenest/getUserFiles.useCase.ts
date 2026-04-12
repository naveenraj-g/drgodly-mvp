import { getSharedInjection } from "../../../../shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TGetUserFilesPayload,
  TUserFiles,
} from "../../../../../shared/entities/models/filenest/filenest";

export async function getUserFilesUseCase(
  input: Omit<TGetUserFilesPayload, "appId"> & { userId: string }
): Promise<TUserFiles> {
  const userService = getSharedInjection("IUserService");
  const filenestRepository = getFilenestInjection("IFilenestRepository");
  const sharedAppRepository = getSharedInjection("IAppRepository");

  const ok = await userService.isUserInOrg(input.userId, input.orgId);
  if (!ok)
    throw new Error("Access denied: the user must be part of the organization");

  const app = await sharedAppRepository.getAppsByOrgIdAndSlug(
    input.orgId,
    input.appSlug
  );

  if (!app) {
    throw new Error("App not found");
  }

  return filenestRepository.getUserFiles({
    userId: input.userId,
    orgId: input.orgId,
    appId: app.id,
    appSlug: input.appSlug,
  });
}
