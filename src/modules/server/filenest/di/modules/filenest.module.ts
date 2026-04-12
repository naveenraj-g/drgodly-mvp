import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IFilenestRepository } from "../../application/repositories/filenestRepository.interface";
import { FilenestRepository } from "../../infrastructure/repositories/filenestRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IFilenestRepository>(DI_SYMBOLS.IFilenestRepository)
    .to(FilenestRepository)
    .inSingletonScope();
};

export const FilenestModule = new ContainerModule(initializeModules);
