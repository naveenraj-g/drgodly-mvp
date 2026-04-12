import { injectable } from "inversify";
import { IAppStorageSettingRepository } from "../../application/repositories/appStorageSettingRepository.interface";
import {
  TAppStorageSettingsSchema,
  TAppStorageSettingSchema,
  TGetAppStorageSettings,
  TCreateAppStorageSetting,
  TUpdateAppStorageSetting,
  TDeleteAppStorageSetting,
  AppStorageSettingsSchema,
  AppStorageSettingSchema,
  GetAppStorageAndUploadconfigByAppIdSchema,
  TGetAppStorageAndUploadconfigByAppIdSchema,
} from "../../../../shared/entities/models/filenest/appStorageSettings";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { prismaFilenest } from "../../../../server/prisma/prisma";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { TGetFileEntitiesByAppId } from "../../../../shared/entities/models/filenest/fileEntity";

@injectable()
export class AppStorageSettingRepository
  implements IAppStorageSettingRepository
{
  constructor() {}

  async getAppStorageSettings(
    getData: TGetAppStorageSettings
  ): Promise<TAppStorageSettingsSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getAppStorageSettingsRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const appStorageSettings =
        await prismaFilenest.appStorageSetting.findMany({
          where: {
            orgId: getData.orgId,
          },
        });

      const data = await AppStorageSettingsSchema.parseAsync(
        appStorageSettings
      );

      logOperation("success", {
        name: "getAppStorageSettingsRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getAppStorageSettingsRepository",
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

  async createAppStorageSetting(
    createData: TCreateAppStorageSetting
  ): Promise<TAppStorageSettingSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "createAppStorageSettingRepository",
      startTimeMs,
      context: { operationId },
    });

    const { userId, ...rest } = createData;

    try {
      const row = await prismaFilenest.appStorageSetting.create({
        data: {
          ...rest,
          createdBy: userId,
          updatedBy: userId,
        },
      });

      const data = await AppStorageSettingSchema.parseAsync(row);

      logOperation("success", {
        name: "createAppStorageSettingRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "createAppStorageSettingRepository",
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

  async updateAppStorageSetting(
    updateData: TUpdateAppStorageSetting
  ): Promise<TAppStorageSettingSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "updateAppStorageSettingRepository",
      startTimeMs,
      context: { operationId },
    });

    const { userId, id, orgId, ...rest } = updateData;

    try {
      const row = await prismaFilenest.appStorageSetting.update({
        where: { id, orgId },
        data: {
          ...rest,
          updatedBy: userId,
        },
      });

      const data = await AppStorageSettingSchema.parseAsync(row);

      logOperation("success", {
        name: "updateAppStorageSettingRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "updateAppStorageSettingRepository",
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

  async deleteAppStorageSetting(
    deleteData: TDeleteAppStorageSetting
  ): Promise<TAppStorageSettingSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "deleteAppStorageSettingRepository",
      startTimeMs,
      context: { operationId },
    });

    const { id, orgId } = deleteData;

    try {
      const row = await prismaFilenest.appStorageSetting.delete({
        where: { id, orgId },
      });

      const data = await AppStorageSettingSchema.parseAsync(row);

      logOperation("success", {
        name: "deleteAppStorageSettingRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "deleteAppStorageSettingRepository",
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

  async getAppStorageAndUploadconfigByAppId(
    getData: TGetFileEntitiesByAppId
  ): Promise<TGetAppStorageAndUploadconfigByAppIdSchema | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getAppStorageAndUploadconfigByAppIdRepository",
      startTimeMs,
      context: { operationId },
    });

    const { appId, appSlug, orgId } = getData;

    try {
      const appSetting = await prismaFilenest.appStorageSetting.findFirst({
        where: {
          appId,
          appSlug,
          orgId,
        },
        include: {
          cloudStorageConfig: {
            where: {
              isActive: true,
            },
          },
          localStorageConfig: {
            where: {
              isActive: true,
            },
          },
        },
      });

      if (!appSetting) {
        logOperation("success", {
          name: "getAppStorageAndUploadconfigByAppIdRepository",
          startTimeMs,
          context: { operationId },
        });
        return null;
      }

      const data = await GetAppStorageAndUploadconfigByAppIdSchema.parseAsync(
        appSetting
      );

      logOperation("success", {
        name: "getAppStorageAndUploadconfigByAppIdRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getAppStorageAndUploadconfigByAppIdRepository",
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

  async getAppStorageTypeByAppSlug(
    getData: TGetFileEntitiesByAppId
  ): Promise<TAppStorageSettingSchema | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getAppStorageTypeByAppSlugRepository",
      startTimeMs,
      context: { operationId },
    });

    const { appId, appSlug, orgId } = getData;

    try {
      const appSetting = await prismaFilenest.appStorageSetting.findFirst({
        where: {
          appId,
          appSlug,
          orgId,
        },
        select: {
          id: true,
          type: true,
        },
      });

      if (!appSetting) {
        logOperation("success", {
          name: "getAppStorageTypeByAppSlugRepository",
          startTimeMs,
          context: { operationId },
        });
        return null;
      }

      const data = await AppStorageSettingSchema.parseAsync(appSetting);

      logOperation("success", {
        name: "getAppStorageTypeByAppSlugRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getAppStorageTypeByAppSlugRepository",
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
