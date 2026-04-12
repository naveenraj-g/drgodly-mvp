import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IDoctorServiceRepository } from "../../application/repositories/doctorServiceRepository.interface";
import { DoctorServiceRepository } from "../../infrastructure/repositories/doctorServiceRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IDoctorServiceRepository>(DI_SYMBOLS.IDoctorServiceRepository)
    .to(DoctorServiceRepository)
    .inSingletonScope();
};

export const DoctorServiceModule = new ContainerModule(initializeModules);
