import { Bind, ContainerModule } from "inversify";
import { ICloudStorageRepository } from "../../application/repositories/cloudStorageRepository.interface";
import { DI_SYMBOLS } from "../types";
import { CloudStorageRepository } from "../../infrastructure/repositories/cloudStorageRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<ICloudStorageRepository>(DI_SYMBOLS.ICloudStorageRepository)
    .to(CloudStorageRepository)
    .inSingletonScope();
};

export const CloudStorageModule = new ContainerModule(initializeModules);
