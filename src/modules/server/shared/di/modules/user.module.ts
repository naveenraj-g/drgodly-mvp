import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IUserService } from "../../user/application/services/userService.interface";
import { UserService } from "../../user/infrastructure/services/userService";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IUserService>(DI_SYMBOLS.IUserService)
    .to(UserService)
    .inSingletonScope();
};

export const UserModule = new ContainerModule(initializeModules);
