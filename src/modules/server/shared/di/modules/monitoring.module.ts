import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IMonitoringService } from "../../monitoring/application/services/monitoringService.interface";
import { MonitoringService } from "../../monitoring/infrastructure/services/monitoringService";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IMonitoringService>(DI_SYMBOLS.IMonitoringService)
    .to(MonitoringService)
    .inSingletonScope();
};

export const MonitoringModule = new ContainerModule(initializeModules);
