import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IAppointmentRepository } from "../../application/repositories/appointmentRepository.interface";
import { AppointmentRepository } from "../../infrastructure/repositories/appointmentRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IAppointmentRepository>(DI_SYMBOLS.IAppointmentRepository)
    .to(AppointmentRepository)
    .inSingletonScope();
};

export const AppointmentModule = new ContainerModule(initializeModules);
