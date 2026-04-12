import { TAppointments } from "@/modules/shared/entities/models/telemedicine/appointment";
import { ZSAError } from "zsa";

export interface IAppointmentTableProps {
  appointments: TAppointments | null;
  error: ZSAError | null;
}

export type TAppointmentStatue =
  | "PENDING"
  | "SCHEDULED"
  | "CANCELLED"
  | "COMPLETED"
  | "INPROGRESS"
  | "RESCHEDULED";
