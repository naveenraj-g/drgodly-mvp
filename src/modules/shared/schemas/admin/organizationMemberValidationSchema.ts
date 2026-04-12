import z from "zod";

export const GetOrganizationMembersValidationSchema = z.object({
  organizationId: z.string(),
});

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

export const AddMemberToOrganizationValidationFormSchema = z.object({
  emailOrUsername: usernameOrEmailSchema,
});

export type TAddMemberToOrganizationValidationFormSchema = z.infer<
  typeof AddMemberToOrganizationValidationFormSchema
>;

export const AddMemberToOrganizationValidationSchema =
  AddMemberToOrganizationValidationFormSchema.merge(
    z.object({
      organizationId: z.string(),
    })
  );

export const RemoveMemberFromOrganizationValidationSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
});
