"use server";

import {
  getUserFilesByEntityController,
  getUserFilesByEntityIdController,
  getUserFilesController,
  TGetUserFilesByEntityControllerOutput,
  TGetUserFilesByEntityIdControllerOutput,
  TGetUserFilesControllerOutput,
} from "@/modules/server/filenest/interface-adapters/controllers/filenest";
import {
  GetUserFilePayloadSchema,
  GetUserFilesByEntityIdPayloadSchema,
  GetUserFilesByEntityPayloadSchema,
} from "@/modules/shared/schemas/filenest/filenestSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getUserFiles = createServerAction()
  .input(GetUserFilePayloadSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetUserFilesControllerOutput>(
      "getUserFiles",
      () => getUserFilesController(input),
      {
        operationErrorMessage: "Failed to get user files.",
      }
    );
  });

export const getUserFilesByEntityAction = createServerAction()
  .input(GetUserFilesByEntityPayloadSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetUserFilesByEntityControllerOutput>(
      "getUserFilesByEntityAction",
      () => getUserFilesByEntityController(input),
      {
        operationErrorMessage: "Failed to get user files.",
      }
    );
  });

export const getUserFilesByEntityIdAction = createServerAction()
  .input(GetUserFilesByEntityIdPayloadSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetUserFilesByEntityIdControllerOutput>(
      "getUserFilesByEntityAction",
      () => getUserFilesByEntityIdController(input),
      {
        operationErrorMessage: "Failed to get user files.",
      }
    );
  });
