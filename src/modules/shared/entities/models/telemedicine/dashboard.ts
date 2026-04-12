import z from "zod";
import { ZodEGender } from "../../enums/telemedicine/profile";
import { ZodEAppointmentStatus } from "../../enums/telemedicine/appointment";

const IdsSchema = z.object({
  userId: z.string().min(1),
  patientId: z.string().min(1).nullable(),
  doctorId: z.string().min(1).nullable(),
  id: z.string().min(1).nullable(),
  orgId: z.string().min(1),
});
type TIdsSchema = z.infer<typeof IdsSchema>;

export const PatientDataSchema = z.object({
  userId: z.string(),
  patientId: z.number(),
  orgId: z.string(),
  id: z.string(),

  isCompleted: z.boolean(),
  isABHAPatientProfile: z.boolean(),

  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TPatientData = z.infer<typeof PatientDataSchema>;

/* Personal info */
const DoctorPersonalSchema = z.object({
  orgId: z.string(),
  id: z.string(),
  fullName: z.string(),
  gender: z.string(),
});

const PatientPersonalSchema = z.object({
  orgId: z.string(),
  id: z.string(),
  name: z.string(),
  gender: ZodEGender,
});

/* Doctor */
const DoctorSchema = z.object({
  userId: z.string().nullable(),
  orgId: z.string(),
  personal: DoctorPersonalSchema.nullable(),
});

/* Patient */
const PatientSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  personal: PatientPersonalSchema.nullable(),
});

export const DashboardAppointmentSchema = z.object({
  /* Relations */
  doctor: DoctorSchema,
  patient: PatientSchema,

  /* Core fields */
  orgId: z.string(),
  type: z.string(),
  status: ZodEAppointmentStatus,
  id: z.string(),

  /* Audit */
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),

  /* Appointment details */
  appointmentDate: z.date(),
  time: z.string(),

  price: z.number().nullable(),
  priceCurrency: z.string().nullable(),
  note: z.string().nullable(),

  appointmentMode: z.enum(["VIRTUAL", "INPERSON"]),
  virtualRoomId: z.string().nullable(),

  cancelReason: z.string().nullable(),
  cancelledBy: z.enum(["PATIENT", "DOCTOR"]).nullable(),

  isPatientDeleted: z.boolean(),
  isDoctorDeleted: z.boolean(),
});

export const DashboardAppointmentsSchema = z.array(DashboardAppointmentSchema);

export type TAppointment = z.infer<typeof DashboardAppointmentSchema>;
export type TAppointments = z.infer<typeof DashboardAppointmentsSchema>;

export type TGetDashboardAppointmentsDataPayload = Pick<
  TIdsSchema,
  "patientId" | "orgId" | "doctorId"
>;
export type TGetDashboardAppointmentsDataUseCasePayload = Pick<
  TIdsSchema,
  "orgId" | "userId"
>;
