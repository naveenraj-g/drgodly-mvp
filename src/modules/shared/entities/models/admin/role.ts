import z from "zod";

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TRole = z.infer<typeof RoleSchema>;

export const RolesDataSchema = z.object({
  roleDatas: z.array(RoleSchema),
  total: z.number(),
});
export type TRolesData = z.infer<typeof RolesDataSchema>;

export const CreateRoleSchema = RoleSchema.pick({
  name: true,
  description: true,
});
export type TCreateRole = z.infer<typeof CreateRoleSchema>;

export const UpdateRoleSchema = RoleSchema.pick({
  id: true,
  name: true,
  description: true,
});
export type TUpdateRole = z.infer<typeof UpdateRoleSchema>;
