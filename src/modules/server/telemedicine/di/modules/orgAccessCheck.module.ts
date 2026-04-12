import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IOrgAccessCheckRepository } from "../../application/repositories/orgAccessCheckRepository.interface";
import { OrgAccessCheckRepository } from "../../infrastructure/repositories/orgAccessCheckRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IOrgAccessCheckRepository>(DI_SYMBOLS.IOrgAccessCheckRepository)
    .to(OrgAccessCheckRepository)
    .inSingletonScope();
};

export const OrgAccessCheckRepositoryModule = new ContainerModule(
  initializeModules
);
