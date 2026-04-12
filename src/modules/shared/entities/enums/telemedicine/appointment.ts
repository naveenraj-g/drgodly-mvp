import z from "zod";

// Appointment Status
export const AppointmentStatus = [
  "PENDING",
  "SCHEDULED",
  "RESCHEDULED",
  "CANCELLED",
  "COMPLETED",
] as const;
export type TAppointmentStatus = (typeof AppointmentStatus)[number];
export const ZodEAppointmentStatus = z.enum(AppointmentStatus, {
  required_error: "Appointment Status is required",
});

// Appointment Mode
const AppointmentMode = ["VIRTUAL", "INPERSON", "INTAKE"] as const;
export type TAppointmentMode = (typeof AppointmentMode)[number];
export const ZodEAppointmentMode = z.enum(AppointmentMode, {
  required_error: "Appointment Mode is required",
});
