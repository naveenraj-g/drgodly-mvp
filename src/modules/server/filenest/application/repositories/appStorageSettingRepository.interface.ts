import { TGetFileEntitiesByAppId as TGetAppStorageSettingByAppId } from "../../../../shared/entities/models/filenest/fileEntity";
import {
  TAppStorageSettingsSchema,
  TAppStorageSettingSchema,
  TGetAppStorageSettings,
  TCreateAppStorageSetting,
  TUpdateAppStorageSetting,
  TDeleteAppStorageSetting,
  TGetAppStorageAndUploadconfigByAppIdSchema,
} from "../../../../shared/entities/models/filenest/appStorageSettings";

export interface IAppStorageSettingRepository {
  getAppStorageSettings(
    getData: TGetAppStorageSettings
  ): Promise<TAppStorageSettingsSchema>;

  createAppStorageSetting(
    createData: TCreateAppStorageSetting
  ): Promise<TAppStorageSettingSchema>;

  updateAppStorageSetting(
    updateData: TUpdateAppStorageSetting
  ): Promise<TAppStorageSettingSchema>;

  deleteAppStorageSetting(
    deleteData: TDeleteAppStorageSetting
  ): Promise<TAppStorageSettingSchema>;

  getAppStorageAndUploadconfigByAppId(
    getData: TGetAppStorageSettingByAppId
  ): Promise<TGetAppStorageAndUploadconfigByAppIdSchema | null>;

  getAppStorageTypeByAppSlug(
    getData: Omit<TGetAppStorageSettingByAppId, "appId">
  ): Promise<TAppStorageSettingSchema | null>;
}
