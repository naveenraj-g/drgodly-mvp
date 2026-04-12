import { IAppointmentRepository } from "../application/repositories/appointmentRepository.interface";
import { IDoctorProfileRepository } from "../application/repositories/doctorProfileRepository.interface";
import { IDoctorRepository } from "../application/repositories/doctorRepository.interface";
import { IDoctorServiceRepository } from "../application/repositories/doctorServiceRepository.interface";
import { IDoctorWeeklyAvailabilityRepository } from "../application/repositories/doctorWeeklyAvailabilityRepository.interface";
import { IIdResolverRepository } from "../application/repositories/idResolverRepository.interface";
import { IOrgAccessCheckRepository } from "../application/repositories/orgAccessCheckRepository.interface";
import { IDashboardRepository } from "../application/repositories/dashboardRepository.interface";
import { IPatientProfileRepository } from "../application/repositories/patientProfileRepository.interface";
import { IABDMService } from "../application/services/abdmService.interface";

export const DI_SYMBOLS = {
  // Repositories
  IDoctorProfileRepository: Symbol.for("IDoctorProfileRepository"),
  IPatientProfileRepository: Symbol.for("IPatientProfileRepository"),
  IAppointmentRepository: Symbol.for("IAppointmentRepository"),
  IDoctorServiceRepository: Symbol.for("IDoctorServiceRepository"),
  IOrgAccessCheckRepository: Symbol.for("IOrgAccessCheckRepository"),
  IIdResolverRepository: Symbol.for("IIdResolverRepository"),
  IDoctorWeeklyAvailabilityRepository: Symbol.for(
    "IDoctorWeeklyAvailabilityRepository"
  ),
  IDoctorRepository: Symbol.for("IDoctorRepository"),
  IDashboardRepository: Symbol.for("IDashboardRepository"),

  // Services
  IABDMService: Symbol.for("IABDMService"),
};

export interface DI_RETURN_TYPES {
  // Repositories
  IDoctorProfileRepository: IDoctorProfileRepository;
  IPatientProfileRepository: IPatientProfileRepository;
  IAppointmentRepository: IAppointmentRepository;
  IDoctorServiceRepository: IDoctorServiceRepository;
  IOrgAccessCheckRepository: IOrgAccessCheckRepository;
  IIdResolverRepository: IIdResolverRepository;
  IDoctorWeeklyAvailabilityRepository: IDoctorWeeklyAvailabilityRepository;
  IDoctorRepository: IDoctorRepository;
  IDashboardRepository: IDashboardRepository;

  // Services
  IABDMService: IABDMService;
}
