import z from "zod";

export const ServiceEntitySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  name: z.string(),
  duration: z.number().int(),
  priceAmount: z.number().nullable(),
  priceCurrency: z.string().nullable(),
  supportedModes: z.array(z.string()),
  description: z.string().nullable(),
  doctorId: z.string(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  name: z.string(),
  duration: z.number().int(),
  priceAmount: z.number().positive().nullable(),
  priceCurrency: z.string().length(3).nullable(),
  supportedModes: z.array(z.enum(["INPERSON", "VIRTUAL"])).min(1),
  description: z.string().nullable(),
  doctorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TService = z.infer<typeof ServiceSchema>;

export const ServicesSchema = z.array(ServiceSchema);
export type TServices = z.infer<typeof ServicesSchema>;

export const ServiceCreateSchema = ServiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend(
  z.object({
    operationBy: z.string(),
  }).shape
);
export type TServiceCreate = z.infer<typeof ServiceCreateSchema>;
export type TServiceCreateForUseCase = Omit<
  z.infer<typeof ServiceCreateSchema> & { userId: string },
  "doctorId"
>;

export const ServiceUpdateSchema = ServiceSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend(
  z.object({
    operationBy: z.string(),
  }).shape
);
export type TServiceUpdate = z.infer<typeof ServiceUpdateSchema>;
export type TServiceUpdateForUseCase = Omit<
  z.infer<typeof ServiceUpdateSchema> & { userId: string },
  "doctorId"
>;
