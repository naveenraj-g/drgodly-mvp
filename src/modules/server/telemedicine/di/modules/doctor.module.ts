import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IDoctorRepository } from "../../application/repositories/doctorRepository.interface";
import { DoctorRepository } from "../../infrastructure/repositories/doctorRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IDoctorRepository>(DI_SYMBOLS.IDoctorRepository)
    .to(DoctorRepository)
    .inSingletonScope();
};

export const DoctorModule = new ContainerModule(initializeModules);
