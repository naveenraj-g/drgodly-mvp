import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IDoctorWeeklyAvailabilityRepository } from "../../application/repositories/doctorWeeklyAvailabilityRepository.interface";
import { DoctorWeeklyAvailabilityRepository } from "../../infrastructure/repositories/doctorWeeklyAvailabilityRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IDoctorWeeklyAvailabilityRepository>(
    DI_SYMBOLS.IDoctorWeeklyAvailabilityRepository
  )
    .to(DoctorWeeklyAvailabilityRepository)
    .inSingletonScope();
};

export const DoctorWeeklyAvailabilityModule = new ContainerModule(
  initializeModules
);
