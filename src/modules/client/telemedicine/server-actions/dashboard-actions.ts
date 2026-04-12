import {
  getDashboardAppointmentsDataController,
  TGetDashboardAppointmentsDataControllerOutput,
} from "@/modules/server/telemedicine/interface-adapters/controllers/dashboard";
import { getDashboardAppointmentsDataValidationSchema } from "@/modules/shared/schemas/telemedicine/dashboard/dashboardValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getDashboardAppointmentsDataAction = createServerAction()
  .input(getDashboardAppointmentsDataValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetDashboardAppointmentsDataControllerOutput>(
      "getDashboardAppointmentsDataAction",
      () => getDashboardAppointmentsDataController(input),
      {
        operationErrorMessage: "Failed to get data.",
      }
    );
  });
