"use server";

import { getUserPreferencesController } from "@/modules/server/shared/userPreferences/interface-adapters/controllers/getUserPreferences.controller";
import { updateUserPreferencesController } from "@/modules/server/shared/userPreferences/interface-adapters/controllers/updateUserPreferences.controller";
import {
  TUserPreference,
  updateUserPreferenceSchema,
} from "@/modules/shared/entities/models/userPreferences/userPreferences";
import { getUserPreferencesValidateSchema } from "@/modules/shared/schemas/userPreferences/userPreferencesValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getUserPreference = createServerAction()
  .input(getUserPreferencesValidateSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TUserPreference | null>(
      "getUserPreference",
      () => getUserPreferencesController(input),
      {
        operationErrorMessage: "Failed to get preference templates.",
      }
    );
  });

export const updateUserPreference = createServerAction()
  .input(updateUserPreferenceSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TUserPreference>(
      "updateUserPreference",
      () => updateUserPreferencesController(input),
      {
        url: "/bezs/settings/preferences",
        revalidatePath: true,
        operationErrorMessage: "Failed to update preference templates.",
      }
    );
  });
