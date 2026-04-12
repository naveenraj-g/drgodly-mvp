"use server";

import { createServerAction } from "zsa";
import { TAppDatas, TApp } from "@/modules/shared/entities/models/admin/app";
import {
  CreateAppValidationSchema,
  UpdateAppValidationFormSchema,
  DeleteAppValidationSchema,
} from "@/modules/shared/schemas/admin/appValidationSchema";
import {
  getAppsController,
  createAppController,
  deleteAppController,
  updateAppController,
} from "@/modules/server/admin/interface-adapters/controllers/app";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";

export const getAllAppsData = createServerAction().handler(async () => {
  return await withMonitoring<TAppDatas>("getAllAppaData", getAppsController, {
    operationErrorMessage: "Failed to get apps.",
  });
});

export const createApp = createServerAction()
  .input(CreateAppValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TApp>(
      "createApp",
      () => createAppController(input),
      {
        url: "/bezs/admin/manage-apps",
        revalidatePath: true,
        operationErrorMessage: "Failed to create app.",
      }
    );
  });

export const editApp = createServerAction()
  .input(UpdateAppValidationFormSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TApp>(
      "editApp",
      () => updateAppController(input),
      {
        url: "/bezs/admin/manage-apps",
        revalidatePath: true,
        operationErrorMessage: "Failed to update app.",
      }
    );
  });

export const deleteApp = createServerAction()
  .input(DeleteAppValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TApp>(
      "deleteApp",
      () => deleteAppController(input),
      {
        url: "/bezs/admin/manage-apps",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete app.",
      }
    );
  });
