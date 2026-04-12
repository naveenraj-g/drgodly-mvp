import z from "zod";

export const MapOrUnMapRbacUserOrgRoleValidationSchema = z.object({
  userId: z.string(),
  roleId: z.string(),
  organizationId: z.string(),
  defaultRedirectUrl: z.string(),
});
