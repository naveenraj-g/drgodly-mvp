import { injectable } from "inversify";
import { ILocalStorageRepository } from "../../application/repositories/localStorageRepository.interface";
import {
  TGetLocalStorageConfig,
  TLocalStorageConfigsSchema,
  TLocalStorageConfigSchema,
  TCreateLocalStorage,
  TUpdateLocalStorage,
  TDeleteLocalStorage,
  LocalStorageConfigsSchema,
  LocalStorageConfigSchema,
} from "../../../../shared/entities/models/filenest/localStorage";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { prismaFilenest } from "../../../../server/prisma/prisma";
import { OperationError } from "../../../../shared/entities/errors/commonError";

@injectable()
export class LocalStorageRepository implements ILocalStorageRepository {
  constructor() {}

  async getLocalStorageConfigs(
    getData: TGetLocalStorageConfig
  ): Promise<TLocalStorageConfigsSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getLocalStorageConfigsRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const localStorageConfigs =
        await prismaFilenest.localStorageConfig.findMany({
          where: {
            orgId: getData.orgId,
          },
        });

      const data = await LocalStorageConfigsSchema.parseAsync(
        localStorageConfigs
      );

      logOperation("success", {
        name: "getLocalStorageConfigsRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getLocalStorageConfigsRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async createLocalStorageConfig(
    createData: TCreateLocalStorage
  ): Promise<TLocalStorageConfigSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "createLocalStorageConfigRepository",
      startTimeMs,
      context: { operationId },
    });

    const { userId, ...rest } = createData;

    try {
      const localStorageConfig = await prismaFilenest.localStorageConfig.create(
        {
          data: {
            ...rest,
            createdBy: userId,
            updatedBy: userId,
          },
        }
      );

      const data = await LocalStorageConfigSchema.parseAsync(
        localStorageConfig
      );

      logOperation("success", {
        name: "createLocalStorageConfigRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "createLocalStorageConfigRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updateLocalStorageConfig(
    updateData: TUpdateLocalStorage
  ): Promise<TLocalStorageConfigSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "updateLocalStorageConfigRepository",
      startTimeMs,
      context: { operationId },
    });

    const { userId, id, orgId, ...rest } = updateData;

    try {
      const localStorageConfig = await prismaFilenest.localStorageConfig.update(
        {
          where: { id, orgId },
          data: {
            ...rest,
            updatedBy: userId,
          },
        }
      );

      const data = await LocalStorageConfigSchema.parseAsync(
        localStorageConfig
      );

      logOperation("success", {
        name: "updateLocalStorageConfigRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "updateLocalStorageConfigRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async deleteLocalStorageConfig(
    deleteData: TDeleteLocalStorage
  ): Promise<TLocalStorageConfigSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "deleteLocalStorageConfigRepository",
      startTimeMs,
      context: { operationId },
    });

    const { id, orgId } = deleteData;

    try {
      const localStorageConfig = await prismaFilenest.localStorageConfig.delete(
        {
          where: { id, orgId },
        }
      );

      const data = await LocalStorageConfigSchema.parseAsync(
        localStorageConfig
      );

      logOperation("success", {
        name: "deleteLocalStorageConfigRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "deleteLocalStorageConfigRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
