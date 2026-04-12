"use server";

import {
  createPreferenceTemplateController,
  getPreferenceTemplatesController,
} from "@/modules/server/admin/interface-adapters/controllers/preferenceTemplate";
import {
  TPreferenceTemplate,
  TPreferenceTemplates,
} from "@/modules/shared/entities/models/admin/preferenceTemplete";
import { PreferenceTemplateValidationSchema } from "@/modules/shared/schemas/admin/preferenceTemplateValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getAllPreferenceTemplates = createServerAction().handler(
  async () => {
    return await withMonitoring<TPreferenceTemplates>(
      "getAllPreferenceTemplates",
      getPreferenceTemplatesController,
      {
        operationErrorMessage: "Failed to get preference templates.",
      }
    );
  }
);

export const createPreferenceTemplate = createServerAction()
  .input(PreferenceTemplateValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TPreferenceTemplate>(
      "createPreferenceTemplate",
      () => createPreferenceTemplateController(input),
      {
        url: "/bezs/admin/manage-preferences",
        revalidatePath: true,
        operationErrorMessage: "Failed to create preference template.",
      }
    );
  });
