import { injectable } from "inversify";
import { IFilenestRepository } from "../../application/repositories/filenestRepository.interface";
import {
  TGetUserFilesByEntityIdPayload,
  TGetUserFilesByEntityPayload,
  TGetUserFilesPayload,
  TUserFiles,
  UserFilesSchema,
} from "../../../../shared/entities/models/filenest/filenest";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { prismaFilenest } from "../../../../server/prisma/prisma";
import { OperationError } from "../../../../shared/entities/errors/commonError";

injectable();
export class FilenestRepository implements IFilenestRepository {
  constructor() {}

  async getUserFiles(payload: TGetUserFilesPayload): Promise<TUserFiles> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getUserFilesRepository",
      startTimeMs,
      context: { operationId },
    });

    const { appId, appSlug, orgId, userId } = payload;

    try {
      const userFiles = await prismaFilenest.userFile.findMany({
        where: {
          orgId,
          appId,
          userId,
          appSlug,
        },
        select: {
          id: true,
          userId: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          storageType: true,
          filePath: true,
          referenceType: true,
          referenceId: true,
          createdAt: true,
          updatedAt: true,
          fileEntityId: true,
          fileEntity: {
            select: {
              id: true,
              type: true,
              name: true,
              label: true,
              subFolder: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const data = await UserFilesSchema.parseAsync(userFiles);

      logOperation("success", {
        name: "getUserFilesRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getUserFilesRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async checkFileOwnerByUserIdAndOrgId(
    userId: string,
    orgId: string,
    userFileId: bigint
  ): Promise<boolean> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "checkFileOwnerByUserIdAndOrgIdRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const file = await prismaFilenest.userFile.findUnique({
        where: {
          id: userFileId,
          userId,
          orgId,
        },
      });

      if (!file) {
        logOperation("success", {
          name: "checkFileOwnerByUserIdAndOrgIdRepository",
          startTimeMs,
          context: { operationId },
        });
        return false;
      }

      logOperation("success", {
        name: "checkFileOwnerByUserIdAndOrgIdRepository",
        startTimeMs,
        context: { operationId },
      });

      return true;
    } catch (error) {
      logOperation("error", {
        name: "checkFileOwnerByUserIdAndOrgIdRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getUserFilesByEntity(
    payload: TGetUserFilesByEntityPayload
  ): Promise<TUserFiles> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getUserFilesByEntityRepository",
      startTimeMs,
      context: { operationId },
    });

    const { appId, appSlug, orgId, userId, type, name } = payload;

    try {
      const userFiles = await prismaFilenest.userFile.findMany({
        where: {
          orgId,
          appId,
          userId,
          appSlug,
          fileEntity: {
            type,
            name: name ? name : undefined,
          },
        },
        select: {
          id: true,
          userId: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          storageType: true,
          filePath: true,
          referenceType: true,
          referenceId: true,
          createdAt: true,
          updatedAt: true,
          fileEntityId: true,
          fileEntity: {
            select: {
              id: true,
              type: true,
              name: true,
              label: true,
              subFolder: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const data = await UserFilesSchema.parseAsync(userFiles);

      logOperation("success", {
        name: "getUserFilesByEntityRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getUserFilesByEntityRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getUserFilesByEntityId(
    payload: TGetUserFilesByEntityIdPayload
  ): Promise<TUserFiles> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getUserFilesByEntityIdRepository",
      startTimeMs,
      context: { operationId },
    });

    const { appId, appSlug, orgId, userId, id } = payload;

    try {
      const userFiles = await prismaFilenest.userFile.findMany({
        where: {
          orgId,
          appId,
          userId,
          appSlug,
          fileEntity: {
            id,
          },
        },
        select: {
          id: true,
          userId: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          storageType: true,
          filePath: true,
          referenceType: true,
          referenceId: true,
          createdAt: true,
          updatedAt: true,
          fileEntityId: true,
          fileEntity: {
            select: {
              id: true,
              type: true,
              name: true,
              label: true,
              subFolder: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const data = await UserFilesSchema.parseAsync(userFiles);

      logOperation("success", {
        name: "getUserFilesByEntityIdRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getUserFilesByEntityIdRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
