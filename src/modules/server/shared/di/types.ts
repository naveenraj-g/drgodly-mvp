import { IMonitoringService } from "../monitoring/application/services/monitoringService.interface";
import { IUserService } from "../user/application/services/userService.interface";
export const DI_SYMBOLS = {
  // Services
  IMonitoringService: Symbol.for("IMonitoringService"),
  IUserService: Symbol.for("IUserService"),
};

export interface DI_RETURN_TYPES {
  // Services
  IMonitoringService: IMonitoringService;
  IUserService: IUserService;
}
