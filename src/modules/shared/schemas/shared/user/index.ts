import z from "zod";

export const GetUsersByIdAndOrgIdValidationSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
});
export type TGetUsersByIdAndOrgIdValidationSchema = z.infer<
  typeof GetUsersByIdAndOrgIdValidationSchema
>;

export const GetUserByUserNameOrEmailAndOrgIdValidationSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  orgId: z.string(),
});
export type TGetUserByUserNameOrEmailAndOrgIdValidationSchema = z.infer<
  typeof GetUserByUserNameOrEmailAndOrgIdValidationSchema
>;
