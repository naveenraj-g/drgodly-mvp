import { z } from "zod";
import { ZodEStorageType } from "../../enums/filenest/storage";

export type TGetUserFilesPayload = {
  userId: string;
  orgId: string;
  appId: string;
  appSlug: string;
};

export type TGetUserFilesByEntityPayload = {
  userId: string;
  orgId: string;
  appId: string;
  appSlug: string;
  type: string;
  name?: string | null;
};

export type TGetUserFilesByEntityIdPayload = {
  userId: string;
  orgId: string;
  appId: string;
  appSlug: string;
  id: bigint;
};

/* FileEntity schema */
export const FileEntitySchema = z.object({
  id: z.bigint(),
  name: z.string(),
  label: z.string(),
  type: z.string(),
  subFolder: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/* UserFile schema */
export const UserFileSchema = z.object({
  userId: z.string().nullable(),
  id: z.bigint(),
  createdAt: z.date(),
  updatedAt: z.date(),

  fileEntity: FileEntitySchema,

  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.bigint(),
  filePath: z.string(),

  storageType: ZodEStorageType,

  referenceType: z.string().nullable(),
  referenceId: z.string().nullable(),

  fileEntityId: z.bigint(),
});

/* Array schema */
export const UserFilesSchema = z.array(UserFileSchema);

/* Types */
export type TUserFile = z.infer<typeof UserFileSchema>;
export type TUserFiles = z.infer<typeof UserFilesSchema>;
