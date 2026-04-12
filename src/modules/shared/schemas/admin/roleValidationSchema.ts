import z from "zod";

export const CreateRoleValidationSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  description: z
    .string()
    .min(5, { message: "description must be atleast 3 character long." })
    .max(150, { message: "description must be atleast 150 character long." }),
});
export type TCreateRoleForm = z.infer<typeof CreateRoleValidationSchema>;

export const UpdateRoleValidationSchema = CreateRoleValidationSchema.merge(
  z.object({
    id: z.string(),
  })
);

export const DeleteRoleValidationSchema = z.object({
  id: z.string(),
});
