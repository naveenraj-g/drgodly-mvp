import { CreateAppSchema } from "../../../../modules/shared/entities/models/admin/app";

import { z } from "zod";

export const CreateAppValidationSchema = CreateAppSchema.extend({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(3, "Slug must be at least 3 characters")
    .refine((val) => val === val.toLowerCase(), {
      message: "Slug must be in lowercase.",
    }),
  description: z
    .string({ required_error: "Description is required" })
    .min(5, "Description must have atleast 5 characters")
    .max(150, "Description must have atmost 150 characters"),
  type: z.enum(["custom", "platform"], {
    required_error: "Type is required",
    invalid_type_error: "Invalid type provided",
  }),
});
export type TCreateAppForm = z.infer<typeof CreateAppValidationSchema>;

export const DeleteAppValidationSchema = z.object({
  id: z.string(),
});

export const UpdateAppValidationFormSchema = CreateAppValidationSchema.merge(
  DeleteAppValidationSchema
);
export type TUpdateAppValidationSchema = z.infer<
  typeof UpdateAppValidationFormSchema
>;
