"use server";

import {
  createUserFilePermissionByOwnerController,
  getUserFilePermissionsByOwnerController,
  TCreateUserFilePermissionByOwnerControllerOutput,
  TGetUserFilePermissionsByOwnerController,
} from "@/modules/server/filenest/interface-adapters/controllers/userFilePermission";
import {
  CreateUserFilePermissionValidationSchema,
  GetUserFilePermissionsByOwnerValidationSchema,
} from "@/modules/shared/schemas/filenest/userFilePermission/userFilePermissionValidationSchemas";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const createUserFilePermissionByOwnerAction = createServerAction()
  .input(CreateUserFilePermissionValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TCreateUserFilePermissionByOwnerControllerOutput>(
      "createUserFilePermissionByOwnerAction",
      () => createUserFilePermissionByOwnerController(input),
      {
        operationErrorMessage: "Failed to share file.",
      }
    );
  });

export const getUserFilePermissionsByOwnerAction = createServerAction()
  .input(GetUserFilePermissionsByOwnerValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetUserFilePermissionsByOwnerController>(
      "getUserFilePermissionsByOwnerAction",
      () => getUserFilePermissionsByOwnerController(input),
      {
        operationErrorMessage: "Failed to get file sharing datas.",
      }
    );
  });
