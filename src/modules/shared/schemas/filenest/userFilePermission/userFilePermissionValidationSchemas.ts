import z from "zod";

/* -------------------------------------------------------------------------- */
/*                                  BASE IDS                                  */
/* -------------------------------------------------------------------------- */

const IdsSchema = z.object({
  id: z.bigint().positive("ID is required"),
  orgId: z.string().min(1, "Org ID is required"),
  userId: z.string().min(1, "User ID is required"),
  appSlug: z.string().min(1, "App slug is required"),
});

/* -------------------------------------------------------------------------- */
/*                         USER FILE PERMISSION BASE                           */
/* -------------------------------------------------------------------------- */

const BaseUserFilePermissionSchema = z.object({
  userFileId: z.bigint(),
  //   ownerUserId: z.string().min(1, "Shared user ID is required"),
  sharedUserId: z.string().min(1, "Shared user ID is required"),
  canView: z.boolean(),
  canDownload: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                         GET PERMISSIONS (OWNER)                             */
/* -------------------------------------------------------------------------- */

export const GetUserFilePermissionsByOwnerValidationSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
  appSlug: z.string().min(1),
});

export type TGetUserFilePermissionsByOwnerValidationSchema = z.infer<
  typeof GetUserFilePermissionsByOwnerValidationSchema
>;

/* -------------------------------------------------------------------------- */
/*                       GET PERMISSIONS (SHARED USER)                         */
/* -------------------------------------------------------------------------- */

export const GetUserFilePermissionsBySharedValidationSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
  appSlug: z.string().min(1),
});

export type TGetUserFilePermissionsBySharedValidationSchema = z.infer<
  typeof GetUserFilePermissionsBySharedValidationSchema
>;

/* -------------------------------------------------------------------------- */
/*                             CREATE PERMISSION                               */
/* -------------------------------------------------------------------------- */

export const CreateUserFilePermissionValidationSchema =
  BaseUserFilePermissionSchema.and(
    IdsSchema.omit({
      id: true,
      appSlug: true,
    })
  ).superRefine((data, ctx) => {
    if (!data.canView && !data.canDownload) {
      ctx.addIssue({
        path: ["canView"],
        code: z.ZodIssueCode.custom,
        message: "At least one permission must be enabled",
      });
    }

    if (data.userId === data.sharedUserId) {
      ctx.addIssue({
        path: ["sharedUserId"],
        code: z.ZodIssueCode.custom,
        message: "You cannot share a file with yourself",
      });
    }
  });

export type TCreateUserFilePermissionValidationSchema = z.infer<
  typeof CreateUserFilePermissionValidationSchema
>;

/* -------------------------------------------------------------------------- */
/*                             UPDATE PERMISSION                               */
/* -------------------------------------------------------------------------- */

export const UpdateUserFilePermissionValidationSchema =
  BaseUserFilePermissionSchema.and(IdsSchema).superRefine((data, ctx) => {
    if (!data.canView && !data.canDownload) {
      ctx.addIssue({
        path: ["canView"],
        code: z.ZodIssueCode.custom,
        message: "At least one permission must be enabled",
      });
    }
  });

export type TUpdateUserFilePermissionValidationSchema = z.infer<
  typeof UpdateUserFilePermissionValidationSchema
>;

/* -------------------------------------------------------------------------- */
/*                             DELETE PERMISSION                               */
/* -------------------------------------------------------------------------- */

export const DeleteUserFilePermissionValidationSchema = IdsSchema.pick({
  id: true,
  orgId: true,
  userId: true,
}).and(
  BaseUserFilePermissionSchema.pick({
    userFileId: true,
  })
);

export type TDeleteUserFilePermissionValidationSchema = z.infer<
  typeof DeleteUserFilePermissionValidationSchema
>;
