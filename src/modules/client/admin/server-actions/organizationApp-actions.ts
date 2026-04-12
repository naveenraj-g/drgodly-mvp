"use server";

import {
  addAppToOrganizationController,
  getOrganizationAppsController,
  removeAppFromOrganizationController,
} from "@/modules/server/admin/interface-adapters/controllers/organizationApp";
import {
  TOrganizationApp,
  TOrganizationApps,
} from "@/modules/shared/entities/models/admin/organizationApp";
import {
  AddAppToOrganizationValidationSchema,
  GetOrganizationAppsValidationSchema,
} from "@/modules/shared/schemas/admin/organizationAppValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getOrganizationAppsData = createServerAction()
  .input(GetOrganizationAppsValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganizationApps>(
      "getOrganizationAppsData",
      () => getOrganizationAppsController(input),
      {
        operationErrorMessage: "Failed to get org apps.",
      }
    );
  });

export const addAppToOrganization = createServerAction()
  .input(AddAppToOrganizationValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganizationApp>(
      "addAppToOrganization",
      () => addAppToOrganizationController(input),
      {
        url: "/bezs/admin/manage-organizations",
        revalidatePath: true,
        operationErrorMessage: "Failed to add org app.",
      }
    );
  });

export const removeAppFromOrganization = createServerAction()
  .input(AddAppToOrganizationValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TOrganizationApp>(
      "removeAppFromOrganization",
      () => removeAppFromOrganizationController(input),
      {
        url: "/bezs/admin/manage-organizations",
        revalidatePath: true,
        operationErrorMessage: "Failed to remove org app.",
      }
    );
  });
