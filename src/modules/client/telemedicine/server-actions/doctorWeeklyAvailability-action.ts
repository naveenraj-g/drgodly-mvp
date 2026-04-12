"use server";

import {
  getDoctorWeeklyAvailabilityController,
  TGetDoctorWeeklyAvailabilityControllerOutput,
  TUpsertDoctorWeeklyAvailabilityControllerOutput,
  upsertDoctorWeeklyAvailabilityController,
} from "@/modules/server/telemedicine/interface-adapters/controllers/doctorWeeklyAvailability";
import {
  GetDoctorWeeklyAvailabilityValidationSchema,
  UpsertFullWeekValidationSchema,
} from "@/modules/shared/schemas/telemedicine/doctorWeeklyAvailability/doctorWeeklyAvailabilityValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getDoctorWeeklyAvailability = createServerAction()
  .input(GetDoctorWeeklyAvailabilityValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetDoctorWeeklyAvailabilityControllerOutput>(
      "getDoctorWeeklyAvailability",
      () => getDoctorWeeklyAvailabilityController(input),
      {
        operationErrorMessage: "Failed to get weekly availability data.",
      }
    );
  });

export const upsertDoctorWeeklyAvailability = createServerAction()
  .input(UpsertFullWeekValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TUpsertDoctorWeeklyAvailabilityControllerOutput>(
      "upsertDoctorWeeklyAvailability",
      () => upsertDoctorWeeklyAvailabilityController(input),
      {
        url: "/bezs/telemedicine/doctor/settings/availability",
        revalidatePath: true,
        operationErrorMessage: "Failed to update weekly availability data.",
      }
    );
  });
