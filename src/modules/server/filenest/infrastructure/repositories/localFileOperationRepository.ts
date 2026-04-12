import { injectable } from "inversify";
import { ILocalFileOperationRepository } from "../../application/repositories/localFileOperationRepository.interface";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { prismaFilenest } from "../../../prisma/prisma";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import {
  EntitiesAndFilesByAppSchema,
  FileUploadRequiredDataSchema,
  TEntitiesAndFilesByAppSchema,
  TFileDatasSchema,
  TFileUploadRequiredDataSchema,
  TGetEntitiesAndFilesByAppPayloadSchema,
  TGetFileUploadRequiredData,
} from "../../../../shared/entities/models/filenest/fileUpload";

injectable();
export class LocalFileOperationRepository
  implements ILocalFileOperationRepository
{
  constructor() {}

  async getFileUploadRequiredData(
    getData: TGetFileUploadRequiredData
  ): Promise<TFileUploadRequiredDataSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getFileUploadRequiredDataRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const reqData = await prismaFilenest.$transaction(async (tx) => {
        const fileEntities = await tx.fileEntity.findMany({
          where: {
            orgId: getData.orgId,
            appId: getData.appId,
            appSlug: getData.appSlug,
            isActive: true,
          },
        });

        const appStorageSetting = await tx.appStorageSetting.findFirst({
          where: {
            orgId: getData.orgId,
            appId: getData.appId,
            appSlug: getData.appSlug,
          },
        });

        const data = {
          fileEntities,
          maxFileSize: appStorageSetting?.maxFileSize,
        };

        return data;
      });

      const data = await FileUploadRequiredDataSchema.parseAsync(reqData);

      logOperation("success", {
        name: "getFileUploadRequiredDataRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getFileUploadRequiredDataRepository",
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

  async uploadLocalUserFile(
    payload: TFileDatasSchema
  ): Promise<{ success: boolean }> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "uploadLocalUserFileRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      await prismaFilenest.userFile.createMany({
        data: payload,
      });

      const data = { success: true };

      logOperation("success", {
        name: "uploadLocalUserFileRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "uploadLocalUserFileRepository",
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

  async getEntitiesAndFilesByApp(
    payload: TGetEntitiesAndFilesByAppPayloadSchema
  ): Promise<TEntitiesAndFilesByAppSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getEntitiesAndFilesByAppRepository",
      startTimeMs,
      context: { operationId },
    });

    const { appId, appSlug, orgId, userId } = payload;

    try {
      const files = await prismaFilenest.fileEntity.findMany({
        where: {
          orgId,
          appId,
          appSlug,
          isActive: true,
        },
        select: {
          userFiles: {
            where: {
              userId,
              orgId,
              appId,
              appSlug,
            },
            select: {
              id: true,
              fileName: true,
              fileType: true,
              fileSize: true,
              storageType: true,
              filePath: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          id: true,
          type: true,
          name: true,
          label: true,
        },
      });

      const data = await EntitiesAndFilesByAppSchema.parseAsync(files);

      logOperation("success", {
        name: "getEntitiesAndFilesByAppRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getEntitiesAndFilesByAppRepository",
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

  async deleteLocalUserFile(payload: {
    id: bigint;
    fileName: string;
  }): Promise<{ success: boolean }> {
    throw new Error("Method not implemented.");
  }
}
