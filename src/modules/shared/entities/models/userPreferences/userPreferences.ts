import { z } from "zod";

export const UserPreferenceSchema = z.object({
  id: z.string(),
  userId: z.string().min(1, "User ID is required"),
  timezone: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
  country: z.string().optional(),
  currency: z.string(),
  // measurementSystem: z.enum(["metric", "imperial"]),
  numberFormat: z.string(),
  weekStart: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TUserPreference = z.infer<typeof UserPreferenceSchema>;

export const updateUserPreferenceSchema = UserPreferenceSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export type TUpdateUserPreference = z.infer<typeof updateUserPreferenceSchema>;
