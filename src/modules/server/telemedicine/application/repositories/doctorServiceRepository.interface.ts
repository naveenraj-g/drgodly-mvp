import {
  TService,
  TServiceCreate,
  TServiceUpdate,
  TServices,
} from "../../../../shared/entities/models/telemedicine/service";

export interface IDoctorServiceRepository {
  createDoctorService(data: TServiceCreate): Promise<TService>;
  getDoctorServices(doctorId: string, orgId: string): Promise<TServices>;
  getDoctorServiceByIds(
    serviceId: string,
    doctorId: string,
    orgId: string
  ): Promise<TService>;
  updateDoctorService(data: TServiceUpdate): Promise<TService>;
  deleteDoctorService(
    serviceId: string,
    doctorId: string,
    orgId: string
  ): Promise<TService>;
}
