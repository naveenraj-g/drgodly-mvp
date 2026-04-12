"use server";

import {
  getUserByUserNameOrEmailAndOrgIdController,
  getUsersByIdAndOrgIdController,
  TGetUserByUserNameOrEmailAndOrgIdControllerOutput,
  TGetUsersByIdAndOrgIdControllerOutput,
} from "@/modules/server/shared/user/interface-adapters/controllers/user";
import { GetUserByUserNameOrEmailAndOrgIdValidationSchema } from "@/modules/shared/schemas/filenest/filenestSchema";
import { GetUsersByIdAndOrgIdValidationSchema } from "@/modules/shared/schemas/shared/user";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getUsersByIdAndOrgIdAction = createServerAction()
  .input(GetUsersByIdAndOrgIdValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetUsersByIdAndOrgIdControllerOutput>(
      "getUsersByIdAndOrgIdAction",
      () => getUsersByIdAndOrgIdController(input),
      {
        operationErrorMessage: "Failed to get users.",
      }
    );
  });

export const getUserByUserNameOrEmailAndOrgIdAction = createServerAction()
  .input(GetUserByUserNameOrEmailAndOrgIdValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetUserByUserNameOrEmailAndOrgIdControllerOutput>(
      "getUsersByIdAndOrgIdAction",
      () => getUserByUserNameOrEmailAndOrgIdController(input),
      {
        operationErrorMessage: "Failed to get users.",
      }
    );
  });
