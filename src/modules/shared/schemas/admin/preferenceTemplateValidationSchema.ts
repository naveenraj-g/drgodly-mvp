import z from "zod";

export const PreferenceTemplateValidationSchema = z
  .object({
    scope: z.enum(["GLOBAL", "COUNTRY"]),
    country: z.string().optional(),
    timezone: z.string().min(1, "Timezone is required"),
    dateFormat: z.string().min(1, "Date format is required"),
    timeFormat: z.string().min(1, "Time format is required"),
    currency: z.string().min(1, "Currency is required"),
    // measurementSystem: z.string().min(1, "Measurement system is required"),
    numberFormat: z.string().min(1, "Number format is required"),
    weekStart: z.string().min(1, "Week start day is required"),
  })
  .refine(
    (data) =>
      data.scope === "GLOBAL" ||
      (data.scope === "COUNTRY" && data.country?.length),
    {
      message: "Country is required when scope is COUNTRY",
      path: ["country"],
    }
  );

export type TPreferenceTemplateValidation = z.infer<
  typeof PreferenceTemplateValidationSchema
>;
