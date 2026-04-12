import {
  TAppointment,
  TAppointments,
  TBookAppointment,
  TBookIntakeAppointment,
  TCancelAppointment,
  TGetAppointmentByIds,
  TIntakeAppointment,
  TRescheduleAppointment,
} from "../../../../shared/entities/models/telemedicine/appointment";

export interface IAppointmentRepository {
  getAppointmentsForPatient(
    patientId: string,
    orgId: string
  ): Promise<TAppointments>;
  getAppointmentsForDoctor(
    doctorId: string,
    orgId: string
  ): Promise<TAppointments>;
  getAppointmentForOnlineConsultation(
    appointmentId: string,
    orgId: string
  ): Promise<TAppointment | null>;
  bookAppointment(appointmentData: TBookAppointment): Promise<TAppointment>;
  bookIntakeAppointment(
    appointmentData: TBookIntakeAppointment
  ): Promise<TIntakeAppointment>;
  rescheduleAppointment(
    rescheduleData: TRescheduleAppointment,
    status: "RESCHEDULED" | "PENDING"
  ): Promise<TAppointment>;
  getAppointmentByIds(
    appointmentId: string,
    orgId: string
  ): Promise<TGetAppointmentByIds | null>;
  confirmAppointment(
    appointmentId: string,
    userId: string,
    orgId: string
  ): Promise<TAppointment>;
  cancelAppointment(cancelData: TCancelAppointment): Promise<TAppointment>;
  deleteAppointment(
    appointmentId: string,
    orgId: string,
    userId: string,
    actorType: "PATIENT" | "DOCTOR"
  ): Promise<string>;
}
