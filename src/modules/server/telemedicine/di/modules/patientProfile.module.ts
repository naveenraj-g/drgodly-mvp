import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IPatientProfileRepository } from "../../application/repositories/patientProfileRepository.interface";
import { PatientProfileRepository } from "../../infrastructure/repositories/patientProfileRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IPatientProfileRepository>(DI_SYMBOLS.IPatientProfileRepository)
    .to(PatientProfileRepository)
    .inSingletonScope();
};

export const PatientProfileModule = new ContainerModule(initializeModules);
