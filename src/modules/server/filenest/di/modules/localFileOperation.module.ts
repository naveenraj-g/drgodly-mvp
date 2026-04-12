import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { ILocalFileOperationRepository } from "../../application/repositories/localFileOperationRepository.interface";
import { LocalFileOperationRepository } from "../../infrastructure/repositories/localFileOperationRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<ILocalFileOperationRepository>(DI_SYMBOLS.ILocalFileOperationRepository)
    .to(LocalFileOperationRepository)
    .inSingletonScope();
};

export const LocalFileOperationModule = new ContainerModule(initializeModules);
