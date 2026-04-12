"use server";

import {
  getFileUploadRequiredDataController,
  uploadLocalUserFileController,
  TGetFileUploadRequiredDataControllerOutput,
  TUploadLocalUserFileControllerOutput,
} from "@/modules/server/filenest/interface-adapters/controllers/localFileOperation";
import { GetFileEntitiesByAppIdValidationSchema } from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import { FileUploadValidationSchema } from "@/modules/shared/schemas/filenest/fileUploadValidationSchema";
import { getAppSlugServerOnly } from "@/modules/shared/utils/getAppSlugServerOnly";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import z from "zod";
import { createServerAction } from "zsa";

export const getFileUploadRequiredData = createServerAction()
  .input(GetFileEntitiesByAppIdValidationSchema.omit({ appSlug: true }), {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    const { appSlug } = await getAppSlugServerOnly();
    const data = {
      ...input,
      appSlug,
    };

    return await withMonitoring<TGetFileUploadRequiredDataControllerOutput>(
      "getFileUploadRequiredData",
      () => getFileUploadRequiredDataController(data),
      {
        operationErrorMessage: "Failed to get file upload datas.",
      }
    );
  });

export const getFileUploadRequiredDataWithAppSlug = createServerAction()
  .input(GetFileEntitiesByAppIdValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetFileUploadRequiredDataControllerOutput>(
      "getFileUploadRequiredData",
      () => getFileUploadRequiredDataController(input),
      {
        operationErrorMessage: "Failed to get file upload datas.",
      }
    );
  });

export const uploadLocalUserFile = createServerAction()
  .input(
    FileUploadValidationSchema.and(
      z.object({ revalidatePath: z.string().nullish() })
    ),
    { skipInputParsing: true }
  )
  .handler(async ({ input }) => {
    const { revalidatePath: url, ...data } = input;

    return await withMonitoring<TUploadLocalUserFileControllerOutput>(
      "uploadLocalUserFile",
      () => uploadLocalUserFileController(data),
      {
        operationErrorMessage: "Failed to upload file.",
        url,
        revalidatePath: !!url,
      }
    );
  });
