import {
  TGetLocalStorageConfig,
  TCreateLocalStorage,
  TUpdateLocalStorage,
  TDeleteLocalStorage,
  TLocalStorageConfigSchema,
  TLocalStorageConfigsSchema,
} from "../../../../shared/entities/models/filenest/localStorage";

export interface ILocalStorageRepository {
  getLocalStorageConfigs(
    getData: TGetLocalStorageConfig
  ): Promise<TLocalStorageConfigsSchema>;

  createLocalStorageConfig(
    createData: TCreateLocalStorage
  ): Promise<TLocalStorageConfigSchema>;

  updateLocalStorageConfig(
    updateData: TUpdateLocalStorage
  ): Promise<TLocalStorageConfigSchema>;

  deleteLocalStorageConfig(
    deleteData: TDeleteLocalStorage
  ): Promise<TLocalStorageConfigSchema>;
}
