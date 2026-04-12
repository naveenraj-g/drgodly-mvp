// shared/entities/models/telemedicine/doctor-list.ts
import { z } from "zod";

export const AvailabilitySlotLiteSchema = z.object({
  id: z.string(),
  start: z.string(), // stored as string in DB
  end: z.string(), // stored as string in DB
});

export const WeeklyAvailabilityLiteSchema = z.object({
  id: z.string(),
  dayOfWeek: z.string(), // your model uses String (not enum)
  isEnabled: z.boolean(),
  slots: z.array(AvailabilitySlotLiteSchema),
});

export const DoctorServiceLiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number(),
  priceAmount: z.number().nullable(),
  priceCurrency: z.string().nullable(),
  supportedModes: z.any(), // JSON in DB; keep loose here (array/object)
});

export const DoctorPersonalLiteSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  fullName: z.string(),
  gender: z.string().optional().nullable(),
});

export const DoctorListItemSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  fullName: z.string(),
  gender: z.string().optional().nullable(),
  mobileNumber: z.string().optional().nullable(),
  ratingAverage: z.number().nullable(),
  ratingCount: z.number().nullable(),
  speciality: z.string(),
  services: z.array(DoctorServiceLiteSchema),
  weeklyAvailabilities: z.array(WeeklyAvailabilityLiteSchema),
});

export type TDoctorListItem = z.infer<typeof DoctorListItemSchema>;

export const DoctorsListSchema = z.array(DoctorListItemSchema);
export type TDoctorsList = z.infer<typeof DoctorsListSchema>;
