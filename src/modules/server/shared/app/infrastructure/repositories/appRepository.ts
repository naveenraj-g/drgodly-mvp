import { injectable } from "inversify";
import { IAppRepository } from "../../application/repositories/appRepository.interface";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../../shared/utils/server-logger/log-operation";
import { OperationError } from "../../../../../shared/entities/errors/commonError";
import { prismaMain } from "../../../../prisma/prisma";
import { App, Apps, TApp, TApps } from "../../entities/models/app";

injectable();
export class AppRepository implements IAppRepository {
  constructor() {}

  async getAppsByOrgId(orgId: string): Promise<TApps> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getAppsByOrgIdRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const apps = await prismaMain.appOrganization.findMany({
        where: {
          organizationId: orgId,
        },
        include: {
          app: true,
        },
      });

      const appsData = apps.map((app) => app.app);

      const data = await Apps.parseAsync(appsData);

      logOperation("success", {
        name: "getAppsByOrgIdRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getAppsByOrgIdRepository",
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

  async getAppsByOrgIdAndSlug(
    orgId: string,
    slug: string
  ): Promise<TApp | null> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getAppsByOrgIdAndSlugRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const app = await prismaMain.appOrganization.findFirst({
        where: {
          organizationId: orgId,
          app: {
            slug,
          },
        },
        include: {
          app: true,
        },
      });

      if (!app) {
        logOperation("success", {
          name: "getAppsByOrgIdAndSlugRepository",
          startTimeMs,
          context: { operationId },
        });
        return null;
      }

      const appData = app.app;

      const data = await App.parseAsync(appData);

      logOperation("success", {
        name: "getAppsByOrgIdAndSlugRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getAppsByOrgIdAndSlugRepository",
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
