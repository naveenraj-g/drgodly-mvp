import { ZodEAppointmentMode } from "@/modules/shared/entities/enums/telemedicine/appointment";
import z from "zod";

const IdSchema = z.object({
  appointmentId: z
    .string({ invalid_type_error: "AppointmentId must be a string" })
    .min(1, "AppointmentId is required"),
  userId: z
    .string({ invalid_type_error: "UserId must be a string" })
    .min(1, "UserId is required"),
  orgId: z
    .string({ invalid_type_error: "Organization ID must be a string" })
    .min(1, "Organization ID is required"),
});

export const BookAppointmentValidationSchema = z.object({
  patientUserId: z.string({ required_error: "Patient user ID is required." }),
  doctorUserId: z.string({ required_error: "Doctor user ID is required." }),
  orgId: z.string({ required_error: "Organization ID is required." }),
  appointmentDate: z.date({ required_error: "Appointment date is required." }),
  time: z.string({ required_error: "Appointment time is required." }),
  serviceId: z.string({ required_error: "Service ID is required." }),
  appointmentMode: ZodEAppointmentMode,
  note: z.string().nullable(),
  intakeId: z.string().nullable(),
});
export type TBookAppointmentValidation = z.infer<
  typeof BookAppointmentValidationSchema
>;

export const BookIntakeAppointmentValidationSchema = z.object({
  orgId: z.string({ required_error: "Organization ID is required." }),
  patientUserId: z.string({ required_error: "Patient user ID is required." }),
  intakeConversation: z.any().nullable(),
  intakeReport: z.any().nullable(),
});
export type TBookIntakeAppointmentValidation = z.infer<
  typeof BookIntakeAppointmentValidationSchema
>;

export const GetAppointmentValidationSchema = IdSchema.pick({
  userId: true,
  orgId: true,
});

export const RescheduleAppointmentValidationSchema = z.object({
  orgId: z.string({ required_error: "Organization ID is required." }),
  userId: z.string({ required_error: "User ID is required." }),
  appointmentId: z.string({ required_error: "Appointment ID is required." }),
  time: z.string({ required_error: "Appointment time is required." }),
  appointmentDate: z.date({ required_error: "Appointment date is required." }),
});
export type TRescheduleAppointmentValidation = z.infer<
  typeof RescheduleAppointmentValidationSchema
>;

export const CancelAppointmentValidationSchema = IdSchema.pick({
  userId: true,
  orgId: true,
  appointmentId: true,
}).extend(
  z.object({
    cancelReason: z.string().nullable(),
  }).shape
);
export type TCancelAppointmentValidation = z.infer<
  typeof CancelAppointmentValidationSchema
>;

export const DeleteAppointmentValidationSchema = z.object({
  orgId: z.string({ required_error: "Organization ID is required." }),
  userId: z.string({ required_error: "User ID is required." }),
  appointmentId: z.string({ required_error: "Appointment ID is required." }),
});
export type TDeleteAppointmentValidation = z.infer<
  typeof DeleteAppointmentValidationSchema
>;
