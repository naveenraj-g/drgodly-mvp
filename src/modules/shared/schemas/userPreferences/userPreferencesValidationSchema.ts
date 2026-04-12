import z from "zod";

export const UserPreferenceValidationSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  timeFormat: z.string().min(1, "Time format is required"),
  country: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  // measurementSystem: z.string().min(1, "Measurement system is required"),
  numberFormat: z.string().min(1, "Number format is required"),
  weekStart: z.string().min(1, "Week start day is required"),
});
export type TUserPreferenceValidation = z.infer<
  typeof UserPreferenceValidationSchema
>;

export const getUserPreferencesValidateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});
