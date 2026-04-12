import { IAppRepository } from "../app/application/repositories/appRepository.interface";
import { IMonitoringService } from "../monitoring/application/services/monitoringService.interface";
import { IUserRepository } from "../user/application/repositories/userRepository.interface";
import { IUserService } from "../user/application/services/userService.interface";
import { IUserPreferencesRepository } from "../userPreferences/application/repositories/userPreferencesRepository.interface";

export const DI_SYMBOLS = {
  // Repositories
  IUserRepository: Symbol.for("IUserRepository"),
  IUserPreferencesRepository: Symbol.for("IUserPreferencesRepository"),
  IAppRepository: Symbol.for("IAppRepository"),

  // Services
  IMonitoringService: Symbol.for("IMonitoringService"),
  IUserService: Symbol.for("IUserService"),
};

export interface DI_RETURN_TYPES {
  // Repositories
  IUserRepository: IUserRepository;
  IUserPreferencesRepository: IUserPreferencesRepository;
  IAppRepository: IAppRepository;

  // Services
  IMonitoringService: IMonitoringService;
  IUserService: IUserService;
}
