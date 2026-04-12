"use server";

import {
  createCloudStorageConfigController,
  deleteCloudStorageConfigController,
  getCloudStorageConfigsController,
  TCreateCloudStorageConfigControllerOutput,
  TDeleteCloudStorageConfigControllerOutput,
  TGetCloudStorageConfigsControllerOutput,
  TUpdateCloudStorageConfigControllerOutput,
  updateCloudStorageConfigController,
} from "@/modules/server/filenest/interface-adapters/controllers/cloudStorageConfig";
import {
  CreateCloudStorageValidationSchema,
  DeleteCloudStorageValidationSchema,
  GetCloudStorageConfigsValidationSchema,
  UpdateCloudStorageValidationSchema,
} from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getCloudStorageConfigs = createServerAction()
  .input(GetCloudStorageConfigsValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetCloudStorageConfigsControllerOutput>(
      "getCloudStorageConfigs",
      () => getCloudStorageConfigsController(input),
      {
        operationErrorMessage: "Failed to get Cloud Storage Configs.",
      }
    );
  });

export const createCloudStorageConfig = createServerAction()
  .input(CreateCloudStorageValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TCreateCloudStorageConfigControllerOutput>(
      "createCloudStorageConfig",
      () => createCloudStorageConfigController(input),
      {
        url: "/bezs/filenest/admin/cloud-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to create Cloud Storage Config.",
      }
    );
  });

export const updateCloudStorageConfig = createServerAction()
  .input(UpdateCloudStorageValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TUpdateCloudStorageConfigControllerOutput>(
      "updateCloudStorageConfig",
      () => updateCloudStorageConfigController(input),
      {
        url: "/bezs/filenest/admin/cloud-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to update Cloud Storage Config.",
      }
    );
  });

export const deleteCloudStorageConfig = createServerAction()
  .input(DeleteCloudStorageValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDeleteCloudStorageConfigControllerOutput>(
      "updateCloudStorageConfig",
      () => deleteCloudStorageConfigController(input),
      {
        url: "/bezs/filenest/admin/cloud-storage",
        revalidatePath: true,
        operationErrorMessage: "Failed to delete Cloud Storage Config.",
      }
    );
  });
