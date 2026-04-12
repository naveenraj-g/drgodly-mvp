import z from "zod";
import { ZodEStorageType } from "../../enums/filenest/storage"; // match your enum path
import { CloudStorageConfigSchema } from "./cloudStorage";
import { LocalStorageConfigSchema } from "./localStorage";

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

export const AppStorageSettingSchema = z
  .object({
    appId: z.string().min(1, "App ID is required"),
    appSlug: z.string().min(1, "App slug is required"),
    name: z.string().min(1, "Name is required"),
    type: ZodEStorageType, // e.g. "CLOUD" | "LOCAL"
    subFolder: z.string().min(1, "Sub folder is required"),
    maxFileSize: z.number().int().positive(),
    isActive: z.boolean(),
    // priority: z.number().int().min(0).default(100),

    cloudStorageConfigId: z.bigint().nullable(),
    localStorageConfigId: z.bigint().nullable(),
  })
  .superRefine((data, ctx) => {
    // Enforce correct linkage based on type
    if (data.type === "CLOUD") {
      if (!data.cloudStorageConfigId) {
        ctx.addIssue({
          path: ["cloudStorageConfigId"],
          code: z.ZodIssueCode.custom,
          message: "cloudStorageConfigId is required when type is CLOUD",
        });
      }
      if (data.localStorageConfigId) {
        ctx.addIssue({
          path: ["localStorageConfigId"],
          code: z.ZodIssueCode.custom,
          message: "localStorageConfigId must be null when type is CLOUD",
        });
      }
    }

    if (data.type === "LOCAL") {
      if (!data.localStorageConfigId) {
        ctx.addIssue({
          path: ["localStorageConfigId"],
          code: z.ZodIssueCode.custom,
          message: "localStorageConfigId is required when type is LOCAL",
        });
      }
      if (data.cloudStorageConfigId) {
        ctx.addIssue({
          path: ["cloudStorageConfigId"],
          code: z.ZodIssueCode.custom,
          message: "cloudStorageConfigId must be null when type is LOCAL",
        });
      }
    }
  })
  .and(
    IdsSchema.omit({
      userId: true,
    })
  )
  .and(RequiredFieldsSchema);

export type TAppStorageSettingSchema = z.infer<typeof AppStorageSettingSchema>;
export const AppStorageSettingsSchema = z.array(AppStorageSettingSchema);
export type TAppStorageSettingsSchema = z.infer<
  typeof AppStorageSettingsSchema
>;

// Query & command types
export const GetAppStorageSettingsQuerySchema = z.object({
  orgId: z.string().min(1),
});
export type TGetAppStorageSettings = z.infer<
  typeof GetAppStorageSettingsQuerySchema
>;

export type TCreateAppStorageSetting = Omit<
  TAppStorageSettingSchema,
  "id" | "createdAt" | "updatedAt"
> &
  Pick<TIdsSchema, "userId">;

export type TUpdateAppStorageSetting = Omit<
  TAppStorageSettingSchema,
  "createdAt" | "updatedAt"
> &
  Pick<TIdsSchema, "userId">;

export type TDeleteAppStorageSetting = Pick<TIdsSchema, "id" | "orgId">;

export const GetAppStorageAndUploadconfigByAppIdSchema = z
  .object({
    cloudStorageConfig: CloudStorageConfigSchema.nullable(),
    localStorageConfig: LocalStorageConfigSchema.nullable(),
  })
  .and(AppStorageSettingSchema);
export type TGetAppStorageAndUploadconfigByAppIdSchema = z.infer<
  typeof GetAppStorageAndUploadconfigByAppIdSchema
>;
