import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IDoctorProfileRepository } from "../../application/repositories/doctorProfileRepository.interface";
import { DoctorProfileRepository } from "../../infrastructure/repositories/doctorProfileRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IDoctorProfileRepository>(DI_SYMBOLS.IDoctorProfileRepository)
    .to(DoctorProfileRepository)
    .inSingletonScope();
};

export const DoctorProfileModule = new ContainerModule(initializeModules);
