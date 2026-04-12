import {
  TAppointments,
  TGetDashboardAppointmentsDataPayload,
} from "../../../../shared/entities/models/telemedicine/dashboard";

export interface IDashboardRepository {
  getDashboardAppointmentsData(
    payload: TGetDashboardAppointmentsDataPayload
  ): Promise<TAppointments>;
}
