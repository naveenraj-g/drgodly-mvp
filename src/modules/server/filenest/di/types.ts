import { IAppStorageSettingRepository } from "../application/repositories/appStorageSettingRepository.interface";
import { ICloudStorageRepository } from "../application/repositories/cloudStorageRepository.interface";
import { IFileEntityRepository } from "../application/repositories/fileEntityRepository.interface";
import { IFilenestRepository } from "../application/repositories/filenestRepository.interface";
import { ILocalFileOperationRepository } from "../application/repositories/localFileOperationRepository.interface";
import { ILocalStorageRepository } from "../application/repositories/localStorageRepository.interface";
import { IUserFilePermissionRepository } from "../application/repositories/userFilePermissionRepository.interface";

export const DI_SYMBOLS = {
  // Repositorys
  ICloudStorageRepository: Symbol.for("ICloudStorageRepository"),
  ILocalStorageRepository: Symbol.for("ILocalStorageRepository"),
  IAppStorageSettingRepository: Symbol.for("IAppStorageSettingRepository"),
  IFileEntityRepository: Symbol.for("IFileEntityRepository"),
  ILocalFileOperationRepository: Symbol.for("ILocalFileOperationRepository"),
  IFilenestRepository: Symbol.for("IFilenestRepository"),
  IUserFilePermissionRepository: Symbol.for("IUserFilePermissionRepository"),
};

export interface DI_RETURN_TYPES {
  // Repositorys
  ICloudStorageRepository: ICloudStorageRepository;
  ILocalStorageRepository: ILocalStorageRepository;
  IAppStorageSettingRepository: IAppStorageSettingRepository;
  IFileEntityRepository: IFileEntityRepository;
  ILocalFileOperationRepository: ILocalFileOperationRepository;
  IFilenestRepository: IFilenestRepository;
  IUserFilePermissionRepository: IUserFilePermissionRepository;
}
