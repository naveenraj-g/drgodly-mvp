import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IAppRepository } from "../../app/application/repositories/appRepository.interface";
import { AppRepository } from "../../app/infrastructure/repositories/appRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IAppRepository>(DI_SYMBOLS.IAppRepository)
    .to(AppRepository)
    .inSingletonScope();
};

export const AppModule = new ContainerModule(initializeModules);
