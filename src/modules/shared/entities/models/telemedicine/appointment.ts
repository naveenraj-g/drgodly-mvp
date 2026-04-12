import { z } from "zod";
import { ZodEAppointmentMode } from "../../enums/telemedicine/appointment";

// --- Enums ---
export const AppointmentStatusEnum = z.enum([
  "PENDING",
  "SCHEDULED",
  "CANCELLED",
  "COMPLETED",
  "RESCHEDULED",
]);

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

// --- Personal Info Schemas ---
const DoctorPersonalSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  fullName: z.string(),
  gender: z.string().optional(), // assuming may come as string
});

const PatientPersonalSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string(),
  gender: GenderEnum.optional(),
});

// --- Doctor and Patient Schemas ---
const DoctorSchema = z.object({
  orgId: z.string(),
  userId: z.string().nullable(),
  personal: DoctorPersonalSchema.nullable(),
});

const PatientSchema = z.object({
  orgId: z.string(),
  userId: z.string(),
  personal: PatientPersonalSchema.nullable(),
});

const AppointmentActual = z.object({
  id: z.number(),
  orgId: z.string(),
  appointmentId: z.string(),
  intakeConversation: z.any().nullable(),
  intakeReport: z.any().nullable(),
  virtualConversation: z.any().nullable(),
});

// --- Main Appointment Schema ---
export const AppointmentSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  type: z.string(),
  status: AppointmentStatusEnum,
  time: z.string(),
  note: z.string().nullable(),
  appointmentDate: z.date(),
  appointmentMode: ZodEAppointmentMode,
  price: z.number().positive().nullable(),
  priceCurrency: z.string().nullable(),
  virtualRoomId: z.string().nullable(),
  cancelReason: z.string().nullable(),
  cancelledBy: z.enum(["PATIENT", "DOCTOR"]).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  appointmentActual: AppointmentActual.nullable(),
  doctor: DoctorSchema,
  patient: PatientSchema,
});
export type TAppointment = z.infer<typeof AppointmentSchema>;

// --- If it’s an array of appointments ---
export const AppointmentsSchema = z.array(AppointmentSchema);
export type TAppointments = z.infer<typeof AppointmentsSchema>;

export const BookAppointmentSchema = z.object({
  userId: z.string(),
  patientId: z.string(),
  doctorId: z.string(),
  orgId: z.string(),
  appointmentDate: z.date(),
  time: z.string(),
  status: AppointmentStatusEnum,
  type: z.string(),
  price: z.number().positive().nullable(),
  priceCurrency: z.string().nullable(),
  appointmentMode: ZodEAppointmentMode,
  virtualRoomId: z.string().nullable(),
  // conversation: z.any().nullable(),
  // report: z.any().nullable(),
  note: z.string().nullable(),
  intakeId: z.string().nullable(),
});
export type TBookAppointment = z.infer<typeof BookAppointmentSchema>;

export const BookAppointmentUseCaseSchema = BookAppointmentSchema.omit({
  patientId: true,
  doctorId: true,
  virtualRoomId: true,
  status: true,
  type: true,
  price: true,
  priceCurrency: true,
  userId: true,
}).extend(
  z.object({
    patientUserId: z.string(),
    doctorUserId: z.string(),
    serviceId: z.string(),
  }).shape
);
export type TBookAppointmentUseCase = z.infer<
  typeof BookAppointmentUseCaseSchema
>;

export const IntakeAppointmentSchema = z.object({
  id: z.string(),
});
export type TIntakeAppointment = z.infer<typeof IntakeAppointmentSchema>;

export const BookIntakeAppointmentSchema = BookAppointmentSchema.omit({
  virtualRoomId: true,
  intakeId: true,
}).extend(
  z.object({
    intakeConversation: z.any().nullable(),
    intakeReport: z.any().nullable(),
  }).shape
);
export type TBookIntakeAppointment = z.infer<
  typeof BookIntakeAppointmentSchema
>;

export const BookIntakeAppointmentUseCase = z.object({
  orgId: z.string(),
  patientUserId: z.string(),
  intakeConversation: z.any().nullable(),
  intakeReport: z.any().nullable(),
});
export type TBookIntakeAppointmentUseCase = z.infer<
  typeof BookIntakeAppointmentUseCase
>;

export const RescheduleAppointmentSchema = BookAppointmentSchema.pick({
  userId: true,
  orgId: true,
  appointmentDate: true,
  time: true,
}).extend(
  z.object({
    actorType: z.enum(["PATIENT", "DOCTOR"]),
    appointmentId: z.string(),
    fromDate: z.date(),
    fromTime: z.string(),
  }).shape
);
export type TRescheduleAppointment = z.infer<
  typeof RescheduleAppointmentSchema
>;

export const RescheduleAppointmentUseCaseSchema =
  RescheduleAppointmentSchema.pick({
    appointmentId: true,
    userId: true,
    orgId: true,
    appointmentDate: true,
    time: true,
  });
export type TRescheduleAppointmentUseCase = z.infer<
  typeof RescheduleAppointmentUseCaseSchema
>;

export const CancelAppointmentSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  actorType: z.enum(["PATIENT", "DOCTOR"]),
  appointmentId: z.string(),
  cancelReason: z.string().nullable(),
});
export type TCancelAppointment = z.infer<typeof CancelAppointmentSchema>;

export const CancelAppointmentUseCaseSchema = CancelAppointmentSchema.pick({
  appointmentId: true,
  userId: true,
  orgId: true,
  cancelReason: true,
});
export type TCancelAppointmentUseCase = z.infer<
  typeof CancelAppointmentUseCaseSchema
>;

export const confirmAppointmentUseCaseSchema = z.object({
  appointmentId: z.string(),
  userId: z.string(),
  orgId: z.string(),
});
export type TConfirmAppointmentUseCase = z.infer<
  typeof confirmAppointmentUseCaseSchema
>;

export const GetAppointmentByIdsSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  orgId: z.string(),
  id: z.string(),
  appointmentDate: z.date(),
  time: z.string(),
  status: AppointmentStatusEnum,
  isDoctorDeleted: z.boolean(),
  isPatientDeleted: z.boolean(),
  type: z.string(),
  appointmentMode: z.enum(["VIRTUAL", "INPERSON"]),
});
export type TGetAppointmentByIds = z.infer<typeof GetAppointmentByIdsSchema>;
