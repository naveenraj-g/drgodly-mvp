import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TFileEntitiesSchema,
  TGetFileEntitiesByAppId,
} from "../../../../../shared/entities/models/filenest/fileEntity";

export async function getFileEntitiesByAppIdUseCase(
  input: Omit<TGetFileEntitiesByAppId, "appId"> & { userId: string }
): Promise<TFileEntitiesSchema> {
  const userService = getSharedInjection("IUserService");
  const repo = getFilenestInjection("IFileEntityRepository");
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

  return repo.getFileEntitiesByAppId({
    orgId: input.orgId,
    appId: app.id,
    appSlug: input.appSlug,
  });
}
