import z from "zod";
import {
  ZodECloudStorageVendor,
  ZodEStorageType,
} from "../../entities/enums/filenest/storage";

const IdsSchema = z.object({
  id: z.bigint().positive().min(BigInt(1), "ID is required"),
  orgId: z.string().min(1, "Org ID is required"),
  userId: z.string().min(1, "User ID is required"),
  appId: z.string().min(1, "App ID is required"),
});

const BaseCloudStorageSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    vendor: ZodECloudStorageVendor,
    region: z.string().min(1, "Region is required"),
    bucketName: z.string().nullable(),
    containerName: z.string().nullable(),
    clientId: z.string().min(1, "Client ID is required"),
    clientSecret: z.string().min(1, "Client Secret is required"),
    maxFileSize: z.number().min(1),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.vendor === "AWS_S3") {
      if (!data.bucketName || data.bucketName.trim() === "") {
        ctx.addIssue({
          path: ["bucketName"],
          code: z.ZodIssueCode.custom,
          message: "Bucket name is required for AWS S3",
        });
      }
      if (data.containerName && data.containerName.trim() !== "") {
        ctx.addIssue({
          path: ["containerName"],
          code: z.ZodIssueCode.custom,
          message: "Container name must be empty for AWS S3",
        });
      }
    }

    if (data.vendor === "AZURE_BLOB") {
      if (!data.containerName || data.containerName.trim() === "") {
        ctx.addIssue({
          path: ["containerName"],
          code: z.ZodIssueCode.custom,
          message: "Container name is required for Azure Blob",
        });
      }
      if (data.bucketName && data.bucketName.trim() !== "") {
        ctx.addIssue({
          path: ["bucketName"],
          code: z.ZodIssueCode.custom,
          message: "Bucket name must be empty for Azure Blob",
        });
      }
    }
  });

export const GetCloudStorageConfigsValidationSchema = IdsSchema.omit({
  id: true,
  appId: true,
});
export type TGetCloudStorageConfigsValidationSchema = z.infer<
  typeof GetCloudStorageConfigsValidationSchema
>;

export const CreateCloudStorageValidationSchema = BaseCloudStorageSchema.and(
  IdsSchema.omit({
    id: true,
  })
);
export type TCreateCloudStorageValidationSchema = z.infer<
  typeof CreateCloudStorageValidationSchema
>;

export const UpdateCloudStorageValidationSchema =
  BaseCloudStorageSchema.and(IdsSchema);
export type TUpdateCloudStorageValidationSchema = z.infer<
  typeof UpdateCloudStorageValidationSchema
>;

export const DeleteCloudStorageValidationSchema = IdsSchema.pick({
  id: true,
  orgId: true,
  userId: true,
});
export type TDeleteCloudStorageValidationSchema = z.infer<
  typeof DeleteCloudStorageValidationSchema
>;

export const CreateOrUpdateCloudStorageFormSchema = BaseCloudStorageSchema;
export type TCreateOrUpdateCloudStorageFormSchema = z.infer<
  typeof CreateOrUpdateCloudStorageFormSchema
>;

///////////////////////////////////////////////

const BaseLocalStorageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  basePath: z.string().min(1, "Base path is required"),
  maxFileSize: z.number().min(1),
  isActive: z.boolean(),
});

export const GetLocalStorageConfigsValidationSchema = IdsSchema.omit({
  id: true,
  appId: true,
});
export type TGetLocalStorageConfigsValidationSchema = z.infer<
  typeof GetLocalStorageConfigsValidationSchema
>;

export const CreateLocalStorageValidationSchema = BaseLocalStorageSchema.and(
  IdsSchema.omit({
    id: true,
    appId: true,
  })
);
export type TLocalStorageValidationSchema = z.infer<
  typeof CreateLocalStorageValidationSchema
>;

export const UpdateLocalStorageValidationSchema =
  BaseLocalStorageSchema.and(IdsSchema);
export type TUpdateLocalStorageValidationSchema = z.infer<
  typeof UpdateLocalStorageValidationSchema
>;

export const DeleteLocalStorageValidationSchema = IdsSchema.pick({
  id: true,
  orgId: true,
  userId: true,
});
export type TDeleteLocalStorageValidationSchema = z.infer<
  typeof DeleteLocalStorageValidationSchema
>;

export const CreateOrUpdateLocalStorageFormSchema = BaseLocalStorageSchema;
export type TCreateOrUpdateLocalStorageFormSchema = z.infer<
  typeof CreateOrUpdateLocalStorageFormSchema
>;

// ----- AppStorageSetting -----
const BaseAppStorageSettingSchema = z
  .object({
    appId: z.string().min(1, "App ID is required"),
    appSlug: z.string().min(1, "App slug is required"),
    name: z.string().min(1, "Name is required").max(100),
    type: ZodEStorageType, // "CLOUD" | "LOCAL"
    subFolder: z.string().min(1, "Sub folder is required"),
    maxFileSize: z.number().int().min(1),
    isActive: z.boolean(),
    cloudStorageConfigId: z.bigint().nullable(),
    localStorageConfigId: z.bigint().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "CLOUD") {
      if (!data.cloudStorageConfigId) {
        ctx.addIssue({
          path: ["cloudStorageConfigId"],
          code: z.ZodIssueCode.custom,
          message: "cloudStorageConfigId is required for CLOUD",
        });
      }
      if (data.localStorageConfigId) {
        ctx.addIssue({
          path: ["localStorageConfigId"],
          code: z.ZodIssueCode.custom,
          message: "localStorageConfigId must be null for CLOUD",
        });
      }
    }

    if (data.type === "LOCAL") {
      if (!data.localStorageConfigId) {
        ctx.addIssue({
          path: ["localStorageConfigId"],
          code: z.ZodIssueCode.custom,
          message: "localStorageConfigId is required for LOCAL",
        });
      }
      if (data.cloudStorageConfigId) {
        ctx.addIssue({
          path: ["cloudStorageConfigId"],
          code: z.ZodIssueCode.custom,
          message: "cloudStorageConfigId must be null for LOCAL",
        });
      }
    }
  });

export const GetAppStorageSettingsValidationSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
});
export type TGetAppStorageSettingsValidationSchema = z.infer<
  typeof GetAppStorageSettingsValidationSchema
>;

export const CreateAppStorageSettingValidationSchema =
  BaseAppStorageSettingSchema.and(
    IdsSchema.omit({
      id: true,
      appId: true,
    })
  );
export type TCreateAppStorageSettingValidationSchema = z.infer<
  typeof CreateAppStorageSettingValidationSchema
>;

export const UpdateAppStorageSettingValidationSchema =
  BaseAppStorageSettingSchema.and(IdsSchema);
export type TUpdateAppStorageSettingValidationSchema = z.infer<
  typeof UpdateAppStorageSettingValidationSchema
>;

export const DeleteAppStorageSettingValidationSchema = IdsSchema.pick({
  id: true,
  orgId: true,
  userId: true,
});
export type TDeleteAppStorageSettingValidationSchema = z.infer<
  typeof DeleteAppStorageSettingValidationSchema
>;

// Optional: form schema
export const CreateOrUpdateAppStorageSettingFormSchema =
  BaseAppStorageSettingSchema;
export type TCreateOrUpdateAppStorageSettingFormSchema = z.infer<
  typeof CreateOrUpdateAppStorageSettingFormSchema
>;

//////////////////////

const BaseFileEntitySchema = z.object({
  appId: z.string().min(1, "App ID is required"),
  appSlug: z.string().min(1, "App slug is required"),
  type: z.string().min(1, "Type is required"),
  name: z.string().min(1, "Name is required").max(200),
  label: z.string().min(1, "Label is required").max(200),
  subFolder: z.string().nullable(),
  isActive: z.boolean(),
});

// LIST
export const GetFileEntitiesValidationSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
});
export type TGetFileEntitiesValidationSchema = z.infer<
  typeof GetFileEntitiesValidationSchema
>;

// CREATE
export const CreateFileEntityValidationSchema = BaseFileEntitySchema.and(
  IdsSchema.omit({ id: true })
);
export type TCreateFileEntityValidationSchema = z.infer<
  typeof CreateFileEntityValidationSchema
>;

// UPDATE
export const UpdateFileEntityValidationSchema =
  BaseFileEntitySchema.and(IdsSchema);
export type TUpdateFileEntityValidationSchema = z.infer<
  typeof UpdateFileEntityValidationSchema
>;

// DELETE
export const DeleteFileEntityValidationSchema = IdsSchema.pick({
  id: true,
  orgId: true,
  userId: true,
});
export type TDeleteFileEntityValidationSchema = z.infer<
  typeof DeleteFileEntityValidationSchema
>;

// Optional: Form schema for client forms
export const CreateOrUpdateFileEntityFormSchema = BaseFileEntitySchema;
export type TCreateOrUpdateFileEntityFormSchema = z.infer<
  typeof CreateOrUpdateFileEntityFormSchema
>;

// getFileEntitiesByAppId
export const GetFileEntitiesByAppIdValidationSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
  appSlug: z.string().min(1),
});
