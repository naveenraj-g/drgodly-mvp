import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IUserFilePermissionRepository } from "../../application/repositories/userFilePermissionRepository.interface";
import { UserFilePermissionRepository } from "../../infrastructure/repositories/userFilePermissionRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IUserFilePermissionRepository>(DI_SYMBOLS.IUserFilePermissionRepository)
    .to(UserFilePermissionRepository)
    .inSingletonScope();
};

export const UserFilePermissionModule = new ContainerModule(initializeModules);
