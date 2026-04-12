import { injectable } from "inversify";
import { randomUUID } from "crypto";
import { prismaFilenest } from "../../../../server/prisma/prisma";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { IUserFilePermissionRepository } from "../../application/repositories/userFilePermissionRepository.interface";
import {
  UserFilePermissionSchema,
  UserFilePermissionsSchema,
  TGetUserFilePermissionById,
  TGetUserFilePermissionsByOwner,
  TGetUserFilePermissionsByShared,
  TCreateUserFilePermissionByOwner,
  TUpdateUserFilePermissionByOwner,
  TDeleteUserFilePermissionByOwner,
} from "../../../../shared/entities/models/filenest/userFilePermission";

@injectable()
export class UserFilePermissionRepository
  implements IUserFilePermissionRepository
{
  /* -------------------------------------------------------------------------- */
  /*                               Get by ID                                    */
  /* -------------------------------------------------------------------------- */

  async getUserFilePermissionById(data: TGetUserFilePermissionById) {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getUserFilePermissionByIdRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const record = await prismaFilenest.userFilePermission.findFirst({
        where: {
          id: data.id,
          orgId: data.orgId,
        },
      });

      const parsed = await UserFilePermissionSchema.parseAsync(record);

      logOperation("success", {
        name: "getUserFilePermissionByIdRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "getUserFilePermissionByIdRepository",
        startTimeMs,
        err: error,
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("Failed to fetch file permission", {
        cause: error,
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                         Permissions by Owner                                */
  /* -------------------------------------------------------------------------- */

  async getUserFilePermissionsByOwner(data: TGetUserFilePermissionsByOwner) {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getUserFilePermissionsByOwnerRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const records = await prismaFilenest.userFilePermission.findMany({
        where: {
          orgId: data.orgId,
          ownerUserId: data.userId,
          userFile: {
            userId: data.userId,
            appSlug: data.appSlug,
            orgId: data.orgId,
          },
        },
        include: {
          userFile: {
            select: {
              id: true,
              fileName: true,
              fileType: true,
              fileSize: true,
              storageType: true,
              fileId: true,
              filePath: true,
              fileEntityId: true,
              appSlug: true,
              appId: true,
            },
          },
        },
      });

      const parsed = await UserFilePermissionsSchema.parseAsync(records);

      logOperation("success", {
        name: "getUserFilePermissionsByOwnerRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "getUserFilePermissionsByOwnerRepository",
        startTimeMs,
        err: error,
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("Failed to fetch owner permissions", {
        cause: error,
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                        Permissions by Shared User                           */
  /* -------------------------------------------------------------------------- */

  async getUserFilePermissionsByShared(data: TGetUserFilePermissionsByShared) {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getUserFilePermissionsBySharedRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const records = await prismaFilenest.userFilePermission.findMany({
        where: {
          orgId: data.orgId,
          sharedUserId: data.userId,
          userFile: {
            appSlug: data.appSlug,
          },
        },
        include: {
          userFile: {
            select: {
              id: true,
              fileName: true,
              fileType: true,
              fileSize: true,
              storageType: true,
              fileId: true,
              filePath: true,
              fileEntityId: true,
              appSlug: true,
              appId: true,
            },
          },
        },
      });

      const parsed = await UserFilePermissionsSchema.parseAsync(records);

      logOperation("success", {
        name: "getUserFilePermissionsBySharedRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "getUserFilePermissionsBySharedRepository",
        startTimeMs,
        err: error,
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("Failed to fetch shared permissions", {
        cause: error,
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Create                                       */
  /* -------------------------------------------------------------------------- */

  async createUserFilePermissionByOwner(
    data: TCreateUserFilePermissionByOwner
  ) {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "createUserFilePermissionByOwnerRepository",
      startTimeMs,
      context: { operationId },
    });

    const { userId, ...rest } = data;

    try {
      const record = await prismaFilenest.userFilePermission.create({
        data: {
          ...rest,
          createdBy: userId,
          updatedBy: userId,
        },
      });

      const parsed = await UserFilePermissionSchema.parseAsync(record);

      logOperation("success", {
        name: "createUserFilePermissionByOwnerRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "createUserFilePermissionByOwnerRepository",
        startTimeMs,
        err: error,
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("Failed to create permission", {
        cause: error,
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Edit                                         */
  /* -------------------------------------------------------------------------- */

  async updateUserFilePermissionByOwner(
    data: TUpdateUserFilePermissionByOwner
  ) {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "updateUserFilePermissionByOwnerRepository",
      startTimeMs,
      context: { operationId },
    });

    const { id, orgId, userId, ...rest } = data;

    try {
      const record = await prismaFilenest.userFilePermission.update({
        where: {
          id,
          orgId,
          userFile: {
            userId,
          },
        },
        data: {
          ...rest,
          updatedBy: userId,
        },
      });

      const parsed = await UserFilePermissionSchema.parseAsync(record);

      logOperation("success", {
        name: "updateUserFilePermissionByOwnerRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "updateUserFilePermissionByOwnerRepository",
        startTimeMs,
        err: error,
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("Failed to update permission", {
        cause: error,
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Delete                                       */
  /* -------------------------------------------------------------------------- */

  async deleteUserFilePermissionByOwner(
    data: TDeleteUserFilePermissionByOwner
  ) {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "deleteUserFilePermissionByOwnerRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const record = await prismaFilenest.userFilePermission.delete({
        where: {
          id: data.id,
          orgId: data.orgId,
          userFileId: data.userFileId,
          userFile: {
            userId: data.userId,
          },
        },
      });

      const parsed = await UserFilePermissionSchema.parseAsync(record);

      logOperation("success", {
        name: "deleteUserFilePermissionByOwnerRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "deleteUserFilePermissionByOwnerRepository",
        startTimeMs,
        err: error,
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("Failed to delete permission", {
        cause: error,
      });
    }
  }
}
