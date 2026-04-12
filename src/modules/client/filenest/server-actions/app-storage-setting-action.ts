"use server";

import {
  createAppStorageSettingController,
  deleteAppStorageSettingController,
  getAppStorageSettingsController,
  updateAppStorageSettingController,
  TCreateAppStorageSettingControllerOutput,
  TDeleteAppStorageSettingControllerOutput,
  TGetAppStorageSettingsControllerOutput,
  TUpdateAppStorageSettingControllerOutput,
} from "@/modules/server/filenest/interface-adapters/controllers/appStorageSetting";

import {
  CreateAppStorageSettingValidationSchema,
  DeleteAppStorageSettingValidationSchema,
  GetAppStorageSettingsValidationSchema,
  UpdateAppStorageSettingValidationSchema,
} from "@/modules/shared/schemas/filenest/filenestValidationSchemas";

import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getAppStorageSettings = createServerAction()
  .input(GetAppStorageSettingsValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetAppStorageSettingsControllerOutput>(
      "getAppStorageSettings",
      () => getAppStorageSettingsController(input),
      {
        operationErrorMessage: "Failed to get App Storage Settings.",
      }
    );
  });

export const createAppStorageSetting = createServerAction()
  .input(CreateAppStorageSettingValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TCreateAppStorageSettingControllerOutput>(
      "createAppStorageSetting",
      () => createAppStorageSettingController(input),
      {
        url: "/bezs/filenest/admin/app-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to create App Storage Setting.",
      }
    );
  });

export const updateAppStorageSetting = createServerAction()
  .input(UpdateAppStorageSettingValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TUpdateAppStorageSettingControllerOutput>(
      "updateAppStorageSetting",
      () => updateAppStorageSettingController(input),
      {
        url: "/bezs/filenest/admin/app-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to update App Storage Setting.",
      }
    );
  });

export const deleteAppStorageSetting = createServerAction()
  .input(DeleteAppStorageSettingValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDeleteAppStorageSettingControllerOutput>(
      "deleteAppStorageSetting",
      () => deleteAppStorageSettingController(input),
      {
        url: "/bezs/filenest/admin/app-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete App Storage Setting.",
      }
    );
  });
