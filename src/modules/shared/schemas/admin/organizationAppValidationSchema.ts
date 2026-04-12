import z from "zod";

export const GetOrganizationAppsValidationSchema = z.object({
  organizationId: z.string(),
});

export const AddAppToOrganizationValidationFormSchema = z.object({
  appId: z.string().min(2, {
    message: "select a app.",
  }),
});

export type TAddAppToOrganizationValidationForm = z.infer<
  typeof AddAppToOrganizationValidationFormSchema
>;

export const AddAppToOrganizationValidationSchema = z.object({
  organizationId: z.string(),
  appId: z.string(),
});
