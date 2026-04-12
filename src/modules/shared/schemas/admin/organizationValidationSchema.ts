import z from "zod";

export const CreateOrganizationFormSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  slug: z
    .string()
    .min(3, { message: "slug is required." })
    .refine((val) => val === val.toLowerCase(), {
      message: "Slug must be in lowercase.",
    }),
  logo: z.string().nullable(),
  metadata: z.string().nullable(),
});
export type TCreateOrganizationForm = z.infer<
  typeof CreateOrganizationFormSchema
>;

export const UpdateOrganizationFormSchema = CreateOrganizationFormSchema.merge(
  z.object({
    id: z.string(),
  })
);

export const DeleteOrganizationFormSchema = z.object({
  id: z.string(),
});
