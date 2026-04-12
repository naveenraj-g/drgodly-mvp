import z from "zod";

export const AddRoleAppMenuItemValidationFormSchema = z.object({
  appId: z.string().min(2, {
    message: "select a app.",
  }),
});
export type TAddRoleAppMenuItemValidationForm = z.infer<
  typeof AddRoleAppMenuItemValidationFormSchema
>;

export const getRoleAppMenuItemsValidateSchema = z.object({
  appId: z.string(),
  roleId: z.string(),
});

export const MapOrUnmapAppMenuItemToRoleValidateSchema =
  getRoleAppMenuItemsValidateSchema.merge(
    z.object({
      appMenuItemId: z.string(),
    })
  );
