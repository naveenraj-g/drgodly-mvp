import {
  getAppsByOrgIdController,
  TGetAppsByOrgIdControllerOutput,
} from "@/modules/server/shared/app/interface-adapters/controllers";
import { orgIdSchema } from "@/modules/shared/entities/models/shared/shared";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getAppsByOrgId = createServerAction()
  .input(orgIdSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetAppsByOrgIdControllerOutput>(
      "getFileEntities",
      () => getAppsByOrgIdController(input),
      {
        operationErrorMessage: "Failed to get apps.",
      }
    );
  });
