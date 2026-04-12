"use server";

import {
  createLocalStorageConfigController,
  deleteLocalStorageConfigController,
  getLocalStorageConfigsController,
  updateLocalStorageConfigController,
  TCreateLocalStorageConfigControllerOutput,
  TDeleteLocalStorageConfigControllerOutput,
  TGetLocalStorageConfigsControllerOutput,
  TUpdateLocalStorageConfigControllerOutput,
} from "@/modules/server/filenest/interface-adapters/controllers/localStorageConfig";

import {
  CreateLocalStorageValidationSchema,
  DeleteLocalStorageValidationSchema,
  GetLocalStorageConfigsValidationSchema,
  UpdateLocalStorageValidationSchema,
} from "@/modules/shared/schemas/filenest/filenestValidationSchemas";

import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getLocalStorageConfigs = createServerAction()
  .input(GetLocalStorageConfigsValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetLocalStorageConfigsControllerOutput>(
      "getLocalStorageConfigs",
      () => getLocalStorageConfigsController(input),
      {
        operationErrorMessage: "Failed to get Local Storage Configs.",
      }
    );
  });

export const createLocalStorageConfig = createServerAction()
  .input(CreateLocalStorageValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TCreateLocalStorageConfigControllerOutput>(
      "createLocalStorageConfig",
      () => createLocalStorageConfigController(input),
      {
        url: "/bezs/filenest/admin/local-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to create Local Storage Config.",
      }
    );
  });

export const updateLocalStorageConfig = createServerAction()
  .input(UpdateLocalStorageValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TUpdateLocalStorageConfigControllerOutput>(
      "updateLocalStorageConfig",
      () => updateLocalStorageConfigController(input),
      {
        url: "/bezs/filenest/admin/local-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to update Local Storage Config.",
      }
    );
  });

export const deleteLocalStorageConfig = createServerAction()
  .input(DeleteLocalStorageValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDeleteLocalStorageConfigControllerOutput>(
      "deleteLocalStorageConfig",
      () => deleteLocalStorageConfigController(input),
      {
        url: "/bezs/filenest/admin/local-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete Local Storage Config.",
      }
    );
  });
