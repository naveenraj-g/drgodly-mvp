import z from "zod";

const IdsSchema = z.object({
  id: z.bigint().positive().min(BigInt(1), "ID is required"),
  orgId: z.string().min(1, "Org ID is required"),
  userId: z.string().min(1, "User ID is required"),
});
type TIdsSchema = z.infer<typeof IdsSchema>;

const RequiredFieldsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const FileEntitySchema = z
  .object({
    appId: z.string().min(1, "App ID is required"),
    appSlug: z.string().min(1, "App slug is required"),
    type: z.string().min(1, "Type is required"),
    name: z.string().min(1, "Name is required"),
    label: z.string().min(1, "Label is required"),
    subFolder: z.string().nullable(), // Prisma optional -> nullable in DTO
    isActive: z.boolean(),
  })
  .merge(
    IdsSchema.omit({
      userId: true,
      // id included below via merge with IdsSchema minus userId
    })
  )
  .merge(RequiredFieldsSchema);

export type TFileEntitySchema = z.infer<typeof FileEntitySchema>;
export const FileEntitiesSchema = z.array(FileEntitySchema);
export type TFileEntitiesSchema = z.infer<typeof FileEntitiesSchema>;

export const GetFileEntitiesQuerySchema = z.object({
  orgId: z.string().min(1),
});
export type TGetFileEntities = z.infer<typeof GetFileEntitiesQuerySchema>;

export type TCreateFileEntity = Omit<
  TFileEntitySchema,
  "id" | "createdAt" | "updatedAt"
> &
  Pick<TIdsSchema, "userId">;

export type TUpdateFileEntity = Omit<
  TFileEntitySchema,
  "createdAt" | "updatedAt"
> &
  Pick<TIdsSchema, "userId">;

export type TDeleteFileEntity = Pick<TIdsSchema, "id" | "orgId">;

export type TGetFileEntitiesByAppId = {
  appId: string;
  orgId: string;
  appSlug: string;
};
