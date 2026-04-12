import { z } from "zod";

// Canonical enum values (string literal union friendly with Zod)
export const CloudStorageVendor = ["AWS_S3", "AZURE_BLOB"] as const;
export type TCloudStorageVendor = (typeof CloudStorageVendor)[number];

// Zod enum (reusable in forms, DTOs, server validation, etc.)
export const ZodECloudStorageVendor = z.enum(CloudStorageVendor);

// Handy options for <Select/> components
export const cloudStorageVendorOptions = CloudStorageVendor.map((v) => ({
  value: v,
  label:
    v === "AWS_S3"
      ? "Amazon S3"
      : v === "AZURE_BLOB"
      ? "Azure Blob Storage"
      : v,
}));

const StorageType = ["LOCAL", "CLOUD"] as const;
export type TStorageType = (typeof StorageType)[number];

export const ZodEStorageType = z.enum(StorageType);

export const storageTypeOptions = StorageType.map((v) => ({
  value: v,
  label: v === "LOCAL" ? "Local" : v === "CLOUD" ? "Cloud" : v,
}));
