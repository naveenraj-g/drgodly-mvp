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

export const LocalStorageConfigSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    basePath: z.string().min(1, "Base path is required"),
    maxFileSize: z.number().int().positive(),
    isActive: z.boolean(),
  })
  .merge(
    IdsSchema.omit({
      userId: true,
    })
  )
  .merge(RequiredFieldsSchema);

export type TLocalStorageConfigSchema = z.infer<
  typeof LocalStorageConfigSchema
>;

export const LocalStorageConfigsSchema = z.array(LocalStorageConfigSchema);
export type TLocalStorageConfigsSchema = z.infer<
  typeof LocalStorageConfigsSchema
>;

// ✅ Type aliases for input use
export type TGetLocalStorageConfig = Pick<TIdsSchema, "orgId">;
export type TCreateLocalStorage = Omit<
  TLocalStorageConfigSchema,
  "id" | "createdAt" | "updatedAt"
> &
  Pick<TIdsSchema, "userId">;

export type TUpdateLocalStorage = Omit<
  TLocalStorageConfigSchema,
  "createdAt" | "updatedAt"
> &
  Pick<TIdsSchema, "userId">;

export type TDeleteLocalStorage = Pick<TIdsSchema, "id" | "orgId">;
