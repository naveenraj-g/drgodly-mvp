import { getSharedInjection } from "@/modules/server/shared/di/container";
import { TFileUploadValidationSchema } from "../../../../../shared/schemas/filenest/fileUploadValidationSchema";
import { getFilenestInjection } from "../../../di/container";
import axios from "axios";

export async function uploadLocalUserFileUseCase(
  payload: TFileUploadValidationSchema
) {
  const { appSlug, fileEntityId, orgId, files, userId } = payload;

  const sharedAppRepository = getSharedInjection("IAppRepository");
  const fileEntityRepository = getFilenestInjection("IFileEntityRepository");
  const appStorageSettingRepository = getFilenestInjection(
    "IAppStorageSettingRepository"
  );
  const localFileOperationRepository = getFilenestInjection(
    "ILocalFileOperationRepository"
  );

  const app = await sharedAppRepository.getAppsByOrgIdAndSlug(orgId, appSlug);

  if (!app) {
    throw new Error("Failed to upload files. App not found");
  }

  const fileEntity = await fileEntityRepository.getFileEntityById({
    appId: app.id,
    appSlug,
    id: fileEntityId,
    orgId,
  });

  if (!fileEntity) {
    throw new Error("Failed to upload files. File entity not found");
  }

  const appStorage =
    await appStorageSettingRepository.getAppStorageAndUploadconfigByAppId({
      appId: app.id,
      appSlug,
      orgId,
    });

  if (!appStorage) {
    throw new Error("Failed to upload files. App storage not found");
  }

  if (appStorage.type !== "LOCAL") {
    throw new Error("App storage is not local storage");
  }

  files.forEach((file) => {
    if (file.file.size > appStorage.maxFileSize * 1024 * 1024) {
      throw new Error("File size exceeds " + appStorage.maxFileSize);
    }
  });

  const fileDatas = await Promise.all(
    files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append(
        "basePath",
        appStorage.localStorageConfig?.basePath || ""
      );
      formData.append("folderName", appStorage.subFolder);
      formData.append("subFolderName", fileEntity.subFolder || "");
      formData.append("userId", userId);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL!}/api/file/upload`,
        formData,
        {
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      const d = response.data.data;

      return {
        fileId: d.fileId,
        fileName: d.fileName,
        fileType: d.fileType,
        fileSize: BigInt(d.fileSize),
        filePath: d.filePath,
        userId,
        orgId,
        appId: app.id,
        appSlug,
        fileEntityId,
        referenceId: file.referenceId,
        referenceType: file.referenceType,
        storageType: appStorage.type,
        appStorageSettingId: appStorage.id,
        createdBy: userId,
        updatedBy: userId,
      };
    })
  );

  return await localFileOperationRepository.uploadLocalUserFile(fileDatas);
}
