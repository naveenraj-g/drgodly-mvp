import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IAppStorageSettingRepository } from "../../application/repositories/appStorageSettingRepository.interface";
import { AppStorageSettingRepository } from "../../infrastructure/repositories/appStorageSettingRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IAppStorageSettingRepository>(DI_SYMBOLS.IAppStorageSettingRepository)
    .to(AppStorageSettingRepository)
    .inSingletonScope();
};

export const AppStorageSettingModule = new ContainerModule(initializeModules);
