import z from "zod";

export const CreateAppMenuItemFormSchema = z.object({
  name: z.string().min(1, { message: "name must be atleast 3 characters." }),
  slug: z
    .string()
    .min(3, { message: "slug is required." })
    .refine((val) => val === val.toLowerCase(), {
      message: "Slug must be in lowercase.",
    }),
  description: z
    .string()
    .min(10, { message: "description must be alteast 10 characters long." })
    .max(150, { message: "description must be alteast 150 characters long." }),
  icon: z.string().nullable(),
});

export type TCreateAppMenuItemForm = z.infer<
  typeof CreateAppMenuItemFormSchema
>;

export const CreateAppMenuItemValidationSchema =
  CreateAppMenuItemFormSchema.merge(
    z.object({
      appId: z.string(),
    })
  );

export const UpdateAppMenuItemValidationSchema =
  CreateAppMenuItemValidationSchema.merge(
    z.object({
      id: z.string(),
    })
  );

export const DeleteAppMenuItemValidationSchema = z.object({
  id: z.string(),
  appId: z.string(),
});
