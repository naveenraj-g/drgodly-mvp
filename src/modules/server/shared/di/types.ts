import { IMonitoringService } from "../monitoring/application/services/monitoringService.interface";

export const DI_SYMBOLS = {
  // Services
  IMonitoringService: Symbol.for("IMonitoringService"),
};

export interface DI_RETURN_TYPES {
  // Services
  IMonitoringService: IMonitoringService;
}
