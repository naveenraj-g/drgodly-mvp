import z from "zod";

// Payload for getting a user's files
export const GetUserFilePayloadSchema = z.object({
  userId: z.string().min(1),
  orgId: z.string().min(1),
  appSlug: z.string().min(1),
});
export type TGetUserFilePayload = z.infer<typeof GetUserFilePayloadSchema>;

export const GetUserFilesByEntityPayloadSchema = z.object({
  userId: z.string().min(1),
  orgId: z.string().min(1),
  appSlug: z.string().min(1),
  type: z.string().min(1),
  name: z.string().nullish(),
});
export type TGetUserFilesByEntityPayload = z.infer<
  typeof GetUserFilesByEntityPayloadSchema
>;

export const GetUserFilesByEntityIdPayloadSchema = z.object({
  userId: z.string().min(1),
  orgId: z.string().min(1),
  appSlug: z.string().min(1),
  id: z.bigint(),
});
export type TGetUserFilesByEntityIdPayload = z.infer<
  typeof GetUserFilesByEntityIdPayloadSchema
>;

const usernameOrEmailSchema = z.string().refine(
  (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9._]{3,15}$/;
    return emailRegex.test(value) || usernameRegex.test(value);
  },
  {
    message: "Enter a valid username or email",
  }
);

export const GetUserByUserNameOrEmailAndOrgIdValidationSchema = z.object({
  shareWith: usernameOrEmailSchema,
  orgId: z.string().min(1),
});
export type TGetUserByUserNameOrEmailAndOrgIdValidationSchema = z.infer<
  typeof GetUserByUserNameOrEmailAndOrgIdValidationSchema
>;
