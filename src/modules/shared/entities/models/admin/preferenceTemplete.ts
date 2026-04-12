import z from "zod";

export const PreferenceTemplateSchema = z.object({
  id: z.string(),
  scope: z.enum(["GLOBAL", "COUNTRY"]),
  country: z.string().optional(),
  timezone: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
  currency: z.string(),
  // measurementSystem: z.string(),
  numberFormat: z.string(),
  weekStart: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TPreferenceTemplate = z.infer<typeof PreferenceTemplateSchema>;

export const PreferenceTemplatesSchema = z.object({
  preferenceTemplates: z.array(PreferenceTemplateSchema),
  total: z.number(),
});
export type TPreferenceTemplates = z.infer<typeof PreferenceTemplatesSchema>;

export const CreatePreferenceTemplateSchema = PreferenceTemplateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type TCreatePreferenceTemplate = z.infer<
  typeof CreatePreferenceTemplateSchema
>;
