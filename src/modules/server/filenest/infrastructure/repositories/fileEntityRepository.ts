import { injectable } from "inversify";
import { IFileEntityRepository } from "../../application/repositories/fileEntityRepository.interface";
import {
  TFileEntitiesSchema,
  TFileEntitySchema,
  TGetFileEntities,
  TCreateFileEntity,
  TUpdateFileEntity,
  TDeleteFileEntity,
  FileEntitiesSchema,
  FileEntitySchema,
  TGetFileEntitiesByAppId,
} from "../../../../shared/entities/models/filenest/fileEntity";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { prismaFilenest } from "../../../../server/prisma/prisma";
import { OperationError } from "../../../../shared/entities/errors/commonError";

@injectable()
export class FileEntityRepository implements IFileEntityRepository {
  constructor() {}

  async getFileEntities(
    getData: TGetFileEntities
  ): Promise<TFileEntitiesSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getFileEntitiesRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const fileEntities = await prismaFilenest.fileEntity.findMany({
        where: {
          orgId: getData.orgId,
        },
      });

      const data = await FileEntitiesSchema.parseAsync(fileEntities);

      logOperation("success", {
        name: "getFileEntitiesRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getFileEntitiesRepository",
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

  async createFileEntity(
    createData: TCreateFileEntity
  ): Promise<TFileEntitySchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "createFileEntityRepository",
      startTimeMs,
      context: { operationId },
    });

    const { userId, ...rest } = createData;

    try {
      const row = await prismaFilenest.fileEntity.create({
        data: {
          ...rest,
          createdBy: userId,
          updatedBy: userId,
        },
      });

      const data = await FileEntitySchema.parseAsync(row);

      logOperation("success", {
        name: "createFileEntityRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "createFileEntityRepository",
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

  async updateFileEntity(
    updateData: TUpdateFileEntity
  ): Promise<TFileEntitySchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "updateFileEntityRepository",
      startTimeMs,
      context: { operationId },
    });

    const { userId, id, orgId, ...rest } = updateData;

    try {
      const row = await prismaFilenest.fileEntity.update({
        where: { id, orgId },
        data: {
          ...rest,
          updatedBy: userId,
        },
      });

      const data = await FileEntitySchema.parseAsync(row);

      logOperation("success", {
        name: "updateFileEntityRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "updateFileEntityRepository",
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

  async deleteFileEntity(
    deleteData: TDeleteFileEntity
  ): Promise<TFileEntitySchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "deleteFileEntityRepository",
      startTimeMs,
      context: { operationId },
    });

    const { id, orgId } = deleteData;

    try {
      const row = await prismaFilenest.fileEntity.delete({
        where: { id, orgId },
      });

      const data = await FileEntitySchema.parseAsync(row);

      logOperation("success", {
        name: "deleteFileEntityRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "deleteFileEntityRepository",
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

  async getFileEntitiesByAppId(
    getData: TGetFileEntitiesByAppId
  ): Promise<TFileEntitiesSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getFileEntitiesByAppIdRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const fileEntities = await prismaFilenest.fileEntity.findMany({
        where: {
          orgId: getData.orgId,
          appId: getData.appId,
          appSlug: getData.appSlug,
          isActive: true,
        },
      });

      const data = await FileEntitiesSchema.parseAsync(fileEntities);

      logOperation("success", {
        name: "getFileEntitiesByAppIdRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getFileEntitiesByAppIdRepository",
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

  async getFileEntityById(
    getData: TGetFileEntitiesByAppId & { id: bigint }
  ): Promise<TFileEntitySchema | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getFileEntityByIdRepository",
      startTimeMs,
      context: { operationId },
    });

    const { appId, appSlug, id, orgId } = getData;

    try {
      const fileEntity = await prismaFilenest.fileEntity.findUnique({
        where: {
          id,
          orgId,
          appId,
          appSlug,
          isActive: true,
        },
      });

      if (!fileEntity) {
        logOperation("success", {
          name: "getFileEntityByIdRepository",
          startTimeMs,
          context: { operationId },
        });

        return null;
      }

      const data = await FileEntitySchema.parseAsync(fileEntity);

      logOperation("success", {
        name: "getFileEntityByIdRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getFileEntityByIdRepository",
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
