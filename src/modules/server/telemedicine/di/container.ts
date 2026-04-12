import "reflect-metadata";
import { Container } from "inversify";
import { DI_RETURN_TYPES, DI_SYMBOLS } from "./types";
import {
  AbdmServiceModule,
  AppointmentModule,
  DoctorProfileModule,
  DoctorServiceModule,
  PatientProfileModule,
  IdResolverRepositoryModule,
  OrgAccessCheckRepositoryModule,
  DoctorWeeklyAvailabilityModule,
  DoctorModule,
  DashboardModule,
} from "./modules";

const TelemedicineContainer = new Container({ defaultScope: "Singleton" });

const initializeContainer = () => {
  TelemedicineContainer.load(DoctorProfileModule);
  TelemedicineContainer.load(AbdmServiceModule);
  TelemedicineContainer.load(PatientProfileModule);
  TelemedicineContainer.load(AppointmentModule);
  TelemedicineContainer.load(DoctorServiceModule);
  TelemedicineContainer.load(IdResolverRepositoryModule);
  TelemedicineContainer.load(OrgAccessCheckRepositoryModule);
  TelemedicineContainer.load(DoctorWeeklyAvailabilityModule);
  TelemedicineContainer.load(DoctorModule);
  TelemedicineContainer.load(DashboardModule);
};

initializeContainer();

export const getTelemedicineInjection = <K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] => {
  return TelemedicineContainer.get(DI_SYMBOLS[symbol]);
};

export { TelemedicineContainer };
