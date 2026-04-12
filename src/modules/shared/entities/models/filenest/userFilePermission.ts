import z from "zod";
import { ZodEStorageType } from "../../enums/filenest/storage";

/* -------------------------------------------------------------------------- */
/*                                  Base IDs                                  */
/* -------------------------------------------------------------------------- */

const BaseIdsSchema = z.object({
  id: z.bigint().positive().min(BigInt(1)),
  orgId: z.string().min(1, "Org ID is required"),
  userId: z.string().min(1, "User ID is required"),
  appSlug: z.string().min(1, "App slug is required"),
});
type TBaseIdsSchema = z.infer<typeof BaseIdsSchema>;

/* -------------------------------------------------------------------------- */
/*                              Required Fields                               */
/* -------------------------------------------------------------------------- */

const RequiredFieldsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserFileSchema = z.object({
  id: z.bigint(),
  appId: z.string().nullable(),
  appSlug: z.string().nullable(),
  fileId: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.bigint(),
  storageType: ZodEStorageType,
  filePath: z.string(),
  fileEntityId: z.bigint(),
});

export type TUserFile = z.infer<typeof UserFileSchema>;

/* -------------------------------------------------------------------------- */
/*                         UserFilePermission Schema                           */
/* -------------------------------------------------------------------------- */

export const UserFilePermissionSchema = z
  .object({
    ownerUserId: z.string().min(1),
    sharedUserId: z.string().min(1),
    canView: z.boolean(),
    canDownload: z.boolean(),
    userFileId: z.bigint(),
  })
  .merge(
    BaseIdsSchema.omit({
      userId: true,
      appSlug: true,
    })
  )
  .merge(RequiredFieldsSchema);

export type TUserFilePermissionSchema = z.infer<
  typeof UserFilePermissionSchema
>;

export const UserFilePermissionsSchema = z.array(
  UserFilePermissionSchema.and(
    z.object({
      userFile: UserFileSchema,
    })
  )
);

export type TUserFilePermissionsSchema = z.infer<
  typeof UserFilePermissionsSchema
>;

/* -------------------------------------------------------------------------- */
/*                                   Inputs                                   */
/* -------------------------------------------------------------------------- */

export type TGetUserFilePermissionById = Pick<TBaseIdsSchema, "id" | "orgId">;

export type TGetUserFilePermissionsByOwner = Pick<
  TBaseIdsSchema,
  "orgId" | "userId" | "appSlug"
>;

export type TGetUserFilePermissionsByShared = Pick<
  TBaseIdsSchema,
  "orgId" | "userId" | "appSlug"
>;

export type TCreateUserFilePermissionByOwner = Omit<
  TUserFilePermissionSchema,
  "id" | "createdAt" | "updatedAt"
> &
  Pick<TBaseIdsSchema, "userId">;

export type TUpdateUserFilePermissionByOwner = Omit<
  TUserFilePermissionSchema,
  "createdAt" | "updatedAt"
> &
  Pick<TBaseIdsSchema, "userId">;

export type TDeleteUserFilePermissionByOwner = Pick<
  TBaseIdsSchema,
  "id" | "orgId" | "userId"
> & { userFileId: bigint };
