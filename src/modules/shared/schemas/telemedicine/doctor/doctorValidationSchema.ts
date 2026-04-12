import z from "zod";

const IdsSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  doctorId: z.string(),
});

export const GetDoctorsByOrgSchema = IdsSchema.pick({
  orgId: true,
});
