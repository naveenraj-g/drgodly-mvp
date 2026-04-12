import z from "zod";

const IdsSchema = z.object({
  userId: z.string().min(1),
  patientId: z.string().min(1).nullable(),
  doctorId: z.string().min(1).nullable(),
  id: z.string().min(1).nullable(),
  orgId: z.string().min(1),
});
type TIdsSchema = z.infer<typeof IdsSchema>;

export const getDashboardAppointmentsDataValidationSchema = IdsSchema.pick({
  orgId: true,
  userId: true,
});
