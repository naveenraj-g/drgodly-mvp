"use server";

import {
  getDoctorsByOrgController,
  TGetDoctorsByOrgOutput,
} from "@/modules/server/telemedicine/interface-adapters/controllers/doctor";
import { GetDoctorsByOrgSchema } from "@/modules/shared/schemas/telemedicine/doctor/doctorValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";
import { z } from "zod";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";

export const getDoctorWeeklyAvailability = createServerAction()
  .input(
    z.object({ doctorUserId: z.string().min(1), orgId: z.string().min(1) }),
    { skipInputParsing: true },
  )
  .handler(async ({ input }) => {
    const doctor = await prismaTelemedicine.doctor.findUnique({
      where: { orgId_userId: { orgId: input.orgId, userId: input.doctorUserId } },
      select: {
        weeklyAvailabilities: {
          select: {
            dayOfWeek: true,
            isEnabled: true,
            slots: { select: { start: true, end: true } },
          },
        },
      },
    });
    return doctor?.weeklyAvailabilities ?? [];
  });

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
