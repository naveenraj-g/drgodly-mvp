import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IUserRepository } from "../../user/application/repositories/userRepository.interface";
import { UserRepository } from "../../user/infrastructure/repositories/userRepository";
import { IUserService } from "../../user/application/services/userService.interface";
import { UserService } from "../../user/infrastructure/services/userService";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IUserRepository>(DI_SYMBOLS.IUserRepository)
    .to(UserRepository)
    .inSingletonScope();

  bind<IUserService>(DI_SYMBOLS.IUserService)
    .to(UserService)
    .inSingletonScope();
};

export const UserModule = new ContainerModule(initializeModules);
