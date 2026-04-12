import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { ILocalStorageRepository } from "../../application/repositories/localStorageRepository.interface";
import { LocalStorageRepository } from "../../infrastructure/repositories/localStorageRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<ILocalStorageRepository>(DI_SYMBOLS.ILocalStorageRepository)
    .to(LocalStorageRepository)
    .inSingletonScope();
};

export const LocalStorageModule = new ContainerModule(initializeModules);
