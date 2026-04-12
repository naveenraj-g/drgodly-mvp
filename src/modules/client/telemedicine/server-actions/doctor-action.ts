"use server";

import {
  getDoctorsByOrgController,
  TGetDoctorsByOrgOutput,
} from "@/modules/server/telemedicine/interface-adapters/controllers/doctor";
import { GetDoctorsByOrgSchema } from "@/modules/shared/schemas/telemedicine/doctor/doctorValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getDoctorsByOrg = createServerAction()
  .input(GetDoctorsByOrgSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetDoctorsByOrgOutput>(
      "getDoctorsByOrg",
      () => getDoctorsByOrgController(input),
      {
        operationErrorMessage: "Failed to get doctors data.",
      }
    );
  });
