import { getSharedInjection } from "../../../../shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TFileUploadRequiredDataSchema,
  TGetFileUploadRequiredData,
} from "../../../../../shared/entities/models/filenest/fileUpload";

export async function getFileUploadRequiredDataUseCase(
  input: Omit<TGetFileUploadRequiredData, "appId"> & { userId: string }
): Promise<TFileUploadRequiredDataSchema> {
  const userService = getSharedInjection("IUserService");
  const localFileOperationRepository = getFilenestInjection(
    "ILocalFileOperationRepository"
  );
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

  return localFileOperationRepository.getFileUploadRequiredData({
    orgId: input.orgId,
    appId: app.id,
    appSlug: input.appSlug,
  });
}
