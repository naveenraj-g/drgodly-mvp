import z from "zod";

export const RoleAppMenuItemSchema = z.object({
  id: z.string(),
  appId: z.string(),
  roleId: z.string(),
  appMenuItemId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TRoleAppMenuItem = z.infer<typeof RoleAppMenuItemSchema>;

export const RoleAppMenuItemsDataSchema = z.array(RoleAppMenuItemSchema);
export type TRoleAppMenuItemsData = z.infer<typeof RoleAppMenuItemsDataSchema>;

export const getRoleAppMenuItemsInputSchema = RoleAppMenuItemSchema.pick({
  roleId: true,
  appId: true,
});
export type TGetRoleAppMenuItemsInput = z.infer<
  typeof getRoleAppMenuItemsInputSchema
>;

export const mapOrUnmapAppMenuItemsToRoleInputSchema =
  RoleAppMenuItemSchema.pick({
    roleId: true,
    appId: true,
    appMenuItemId: true,
  });
export type TMapOrUnmapAppMenuItemsToRoleInput = z.infer<
  typeof mapOrUnmapAppMenuItemsToRoleInputSchema
>;
