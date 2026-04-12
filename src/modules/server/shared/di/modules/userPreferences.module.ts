import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IUserPreferencesRepository } from "../../userPreferences/application/repositories/userPreferencesRepository.interface";
import { UserPreferencesRepository } from "../../userPreferences/infrastructure/repositories/userPreferencesRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IUserPreferencesRepository>(DI_SYMBOLS.IUserPreferencesRepository)
    .to(UserPreferencesRepository)
    .inSingletonScope();
};

export const UserPreferencesModule = new ContainerModule(initializeModules);
