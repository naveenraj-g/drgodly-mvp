import { TDoctorsList } from "../../../../shared/entities/models/telemedicine/doctor-list";

export interface IDoctorRepository {
  getDoctorsByOrg(orgId: string): Promise<TDoctorsList>;
}
