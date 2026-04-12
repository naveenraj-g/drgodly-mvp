import z from "zod";
import { ZodECloudStorageVendor } from "../../enums/filenest/storage";

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

export const CloudStorageConfigSchema = z
  .object({
    name: z.string(),
    vendor: ZodECloudStorageVendor,
    region: z.string(),
    bucketName: z.string().nullable(),
    containerName: z.string().nullable(),
    clientId: z.string(),
    clientSecret: z.string(),
    maxFileSize: z.number(),
    isActive: z.boolean(),
  })
  .merge(
    IdsSchema.omit({
      userId: true,
    })
  )
  .merge(RequiredFieldsSchema);
export type TCloudStorageConfigSchema = z.infer<
  typeof CloudStorageConfigSchema
>;

export const CloudStorageConfigsSchema = z.array(CloudStorageConfigSchema);
export type TCloudStorageConfigsSchema = z.infer<
  typeof CloudStorageConfigsSchema
>;

export type TGetCloudStorageConfig = Pick<TIdsSchema, "orgId">;
export type TCreateCloudStorage = Omit<
  TCloudStorageConfigSchema,
  "id" | "createdAt" | "updatedAt"
> &
  Pick<TIdsSchema, "userId">;

export type TUpdateCloudStorage = Omit<
  TCloudStorageConfigSchema,
  "createdAt" | "updatedAt"
> &
  Pick<TIdsSchema, "userId">;

export type TDeleteCloudStorage = Pick<TIdsSchema, "id" | "orgId">;
