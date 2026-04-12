import z from "zod";

const IdSchema = z.object({
  userId: z
    .string({ invalid_type_error: "UserId must be a string" })
    .min(1, "UserId is required"),
  orgId: z
    .string({ invalid_type_error: "Organization ID must be a string" })
    .min(1, "Organization ID is required"),
});

export const GetDoctorWeeklyAvailabilityValidationSchema = IdSchema.pick({
  orgId: true,
  userId: true,
});

export const DayOfWeekSchema = z.enum([
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]);

// Convenience type for a full week payload from UI
export const WeeklySchedulePayloadSchema = z
  .array(
    z.object({
      dayOfWeek: DayOfWeekSchema,
      isEnabled: z.boolean(),
      slots: z
        .array(
          z
            .object({
              start: z.string(),
              end: z.string(),
            })
            .refine((s) => s.start < s.end, {
              message: "Slot start must be before end",
              path: ["end"],
            })
        )
        .default([]),
    })
  )
  .length(7, "Must provide 7 days");

export type TWeeklySchedulePayload = z.infer<
  typeof WeeklySchedulePayloadSchema
>;

export const UpsertFullWeekValidationSchema = z.object({
  userId: z
    .string({ invalid_type_error: "UserId must be a string" })
    .min(1, "UserId is required"),
  orgId: z
    .string({ invalid_type_error: "Organization ID must be a string" })
    .min(1, "Organization ID is required"),
  payload: WeeklySchedulePayloadSchema,
});
export type TUpsertFullWeekValidation = z.infer<
  typeof UpsertFullWeekValidationSchema
>;
