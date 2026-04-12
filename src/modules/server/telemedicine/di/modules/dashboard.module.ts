import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { DashboardRepository } from "../../infrastructure/repositories/dashboardRepository";
import { IDashboardRepository } from "../../application/repositories/dashboardRepository.interface";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IDashboardRepository>(DI_SYMBOLS.IDashboardRepository)
    .to(DashboardRepository)
    .inSingletonScope();
};

export const DashboardModule = new ContainerModule(initializeModules);
