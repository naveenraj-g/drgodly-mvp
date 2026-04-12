import { injectable } from "inversify";
import { ICloudStorageRepository } from "../../application/repositories/cloudStorageRepository.interface";
import {
  TGetCloudStorageConfig,
  TCloudStorageConfigsSchema,
  TCloudStorageConfigSchema,
  TCreateCloudStorage,
  TUpdateCloudStorage,
  TDeleteCloudStorage,
  CloudStorageConfigsSchema,
  CloudStorageConfigSchema,
} from "../../../../shared/entities/models/filenest/cloudStorage";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { prismaFilenest } from "../../../../server/prisma/prisma";
import { OperationError } from "../../../../shared/entities/errors/commonError";

injectable();
export class CloudStorageRepository implements ICloudStorageRepository {
  constructor() {}

  async getCloudStorageConfigs(
    getData: TGetCloudStorageConfig
  ): Promise<TCloudStorageConfigsSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getCloudStorageConfigsRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const cloudStorageConfigs =
        await prismaFilenest.cloudStorageConfig.findMany({
          where: {
            orgId: getData.orgId,
          },
        });

      const data = await CloudStorageConfigsSchema.parseAsync(
        cloudStorageConfigs
      );

      // Success log
      logOperation("success", {
        name: "getCloudStorageConfigsRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "getCloudStorageConfigsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async createCloudStorageConfig(
    createDate: TCreateCloudStorage
  ): Promise<TCloudStorageConfigSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "createCloudStorageConfigRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { userId, ...rest } = createDate;

    try {
      const cloudStorageConfigs =
        await prismaFilenest.cloudStorageConfig.create({
          data: {
            ...rest,
            createdBy: userId,
            updatedBy: userId,
          },
        });

      const data = await CloudStorageConfigSchema.parseAsync(
        cloudStorageConfigs
      );

      // Success log
      logOperation("success", {
        name: "createCloudStorageConfigRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "createCloudStorageConfigRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updateCloudStorageConfig(
    updateData: TUpdateCloudStorage
  ): Promise<TCloudStorageConfigSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "updateCloudStorageConfigRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    const { userId, id, orgId, ...rest } = updateData;

    try {
      const cloudStorageConfigs =
        await prismaFilenest.cloudStorageConfig.update({
          where: {
            id,
            orgId,
          },
          data: {
            ...rest,
            updatedBy: userId,
          },
        });

      const data = await CloudStorageConfigSchema.parseAsync(
        cloudStorageConfigs
      );

      // Success log
      logOperation("success", {
        name: "updateCloudStorageConfigRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "updateCloudStorageConfigRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async deleteCloudStorageConfig(
    deleteData: TDeleteCloudStorage
  ): Promise<TCloudStorageConfigSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "deleteCloudStorageConfigRepository",
      startTimeMs,
      context: {
        operationId,
      },
    });

    // destruct for visual undetstanding
    const { id, orgId } = deleteData;

    try {
      const cloudStorageConfigs =
        await prismaFilenest.cloudStorageConfig.delete({
          where: {
            id,
            orgId,
          },
        });

      const data = await CloudStorageConfigSchema.parseAsync(
        cloudStorageConfigs
      );

      // Success log
      logOperation("success", {
        name: "deleteCloudStorageConfigRepository",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return data;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "deleteCloudStorageConfigRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: {
          operationId,
        },
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
