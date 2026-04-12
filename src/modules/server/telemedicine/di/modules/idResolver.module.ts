import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IIdResolverRepository } from "../../application/repositories/iDResolverRepository.interface";
import { IdResolverRepository } from "../../infrastructure/repositories/idResolverRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IIdResolverRepository>(DI_SYMBOLS.IIdResolverRepository)
    .to(IdResolverRepository)
    .inSingletonScope();
};

export const IdResolverRepositoryModule = new ContainerModule(
  initializeModules
);
