import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IFileEntityRepository } from "../../application/repositories/fileEntityRepository.interface";
import { FileEntityRepository } from "../../infrastructure/repositories/fileEntityRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IFileEntityRepository>(DI_SYMBOLS.IFileEntityRepository)
    .to(FileEntityRepository)
    .inSingletonScope();
};

export const FileEntityModule = new ContainerModule(initializeModules);
