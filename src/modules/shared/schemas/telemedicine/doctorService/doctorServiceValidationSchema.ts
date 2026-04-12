import z from "zod";

const IdSchema = z.object({
  serviceId: z
    .string({ invalid_type_error: "ServiceId must be a string" })
    .min(1, "ServiceId is required"),
  userId: z
    .string({ invalid_type_error: "UserId must be a string" })
    .min(1, "UserId is required"),
  orgId: z
    .string({ invalid_type_error: "Organization ID must be a string" })
    .min(1, "Organization ID is required"),
});

export const GetDoctorServiceValidationSchema = IdSchema.pick({
  orgId: true,
  userId: true,
});
export type TGetDoctorServiceValidation = z.infer<
  typeof GetDoctorServiceValidationSchema
>;

export const DeleteDoctorServiceValidationSchema = IdSchema.pick({
  orgId: true,
  userId: true,
  serviceId: true,
});
export type TDeleteDoctorServiceValidation = z.infer<
  typeof DeleteDoctorServiceValidationSchema
>;

export const DoctorServiceValidationSchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
  name: z.string().min(1, "Service name is required"),
  duration: z.coerce.number().int().positive("Duration must be > 0"),
  priceAmount: z.number().nonnegative("Price cannot be negative").nullable(),
  priceCurrency: z.string().length(3, "Use a 3-letter code").nullable(),
  supportedModes: z
    .array(z.enum(["INPERSON", "VIRTUAL"]))
    .min(1, "Atleast one supported Mode is required"),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters")
    .max(150, "Description must be at most 150 characters")
    .nullable(),
  operationBy: z.string().min(1, "OperationBy is required"),
  userId: z.string().min(1, "User ID is required"),
});
export type TDoctorServiceValidation = z.infer<
  typeof DoctorServiceValidationSchema
>;

export const EditDoctorServiceValidationSchema =
  DoctorServiceValidationSchema.merge(
    z.object({
      id: z.string().min(1, "Service ID is required"),
    })
  );
export type TEditDoctorServiceValidation = z.infer<
  typeof EditDoctorServiceValidationSchema
>;

export const CreateDoctorServiceFormSchema = DoctorServiceValidationSchema.omit(
  {
    orgId: true,
    userId: true,
    operationBy: true,
  }
);
export type TCreateDoctorServiceForm = z.infer<
  typeof CreateDoctorServiceFormSchema
>;
