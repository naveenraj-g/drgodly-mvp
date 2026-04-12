import z from "zod";

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable(),
  metadata: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TOrganization = z.infer<typeof OrganizationSchema>;

export const OrganizationMembersAppsCountSchema = z.object({
  _count: z.object({
    appOrganization: z.number(),
    members: z.number(),
  }),
});

export const OrganizationsTableColumnsSchema = OrganizationSchema.merge(
  OrganizationMembersAppsCountSchema
);
export type TOrganizationsTableColumns = z.infer<
  typeof OrganizationsTableColumnsSchema
>;

export const OrganizationsWithMembersAppsCountSchema = z.array(
  OrganizationSchema.merge(OrganizationMembersAppsCountSchema)
);

export const OrganizationsDataSchema = z.object({
  organizationsData: OrganizationsWithMembersAppsCountSchema,
  total: z.number(),
});
export type TOrganizationsData = z.infer<typeof OrganizationsDataSchema>;

export const CreateOrganizationSchema = OrganizationSchema.pick({
  name: true,
  slug: true,
  logo: true,
  metadata: true,
});
export type TCreateOrganization = z.infer<typeof CreateOrganizationSchema>;

export const UpdateOrganizationSchema = OrganizationSchema.pick({
  id: true,
  name: true,
  slug: true,
  logo: true,
  metadata: true,
});
export type TUpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;

export const DeleteOrganizationSchema = OrganizationSchema.pick({
  id: true,
});
export type TDeleteOrganization = z.infer<typeof DeleteOrganizationSchema>;
