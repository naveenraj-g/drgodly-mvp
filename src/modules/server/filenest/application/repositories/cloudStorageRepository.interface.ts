import {
  TGetCloudStorageConfig,
  TCreateCloudStorage,
  TDeleteCloudStorage,
  TUpdateCloudStorage,
  TCloudStorageConfigsSchema,
  TCloudStorageConfigSchema,
} from "../../../../shared/entities/models/filenest/cloudStorage";

export interface ICloudStorageRepository {
  getCloudStorageConfigs(
    getData: TGetCloudStorageConfig
  ): Promise<TCloudStorageConfigsSchema>;
  createCloudStorageConfig(
    createDate: TCreateCloudStorage
  ): Promise<TCloudStorageConfigSchema>;
  updateCloudStorageConfig(
    updateData: TUpdateCloudStorage
  ): Promise<TCloudStorageConfigSchema>;
  deleteCloudStorageConfig(
    deleteData: TDeleteCloudStorage
  ): Promise<TCloudStorageConfigSchema>;
}
