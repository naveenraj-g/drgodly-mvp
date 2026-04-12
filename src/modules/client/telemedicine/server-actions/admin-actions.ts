"use server";

import { prismaMain, prismaTelemedicine } from "@/modules/server/prisma/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { createServerAction } from "zsa";

export const getUserForDoctorProfileMapping = createServerAction()
  .input(
    z.object({
      orgId: z.string().min(1),
    })
  )
  .handler(async ({ input }) => {
    const { orgId } = input;

    try {
      // 1. Get doctor userIds from telemedicine DB
      const doctors = await prismaTelemedicine.doctor.findMany({
        where: { orgId },
        select: { userId: true },
      });

      const doctorUserIds = doctors
        .map((d) => d.userId)
        .filter((id): id is string => id !== null);

      // 2. Get users NOT in doctor table
      const users = await prismaMain.user.findMany({
        where: {
          // currentOrgId: orgId,
          role: "doctor",
          id: {
            notIn: doctorUserIds.length ? doctorUserIds : undefined,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      return users;
    } catch (err) {
      throw new Error("Failed to fetch user for doctor profile mapping");
    }
  });

export const mapDoctorProfile = createServerAction()
  .input(
    z.object({
      id: z.string().min(1),
      userId: z.string().min(1),
      orgId: z.string().min(1),
    })
  )
  .handler(async ({ input }) => {
    const { userId, orgId, id } = input;

    try {
      await prismaTelemedicine.doctor.update({
        where: { id, orgId },
        data: {
          userId,
        },
      });
      revalidatePath("/bezs/telemedicine/admin/manage-doctors");
    } catch (err) {
      throw new Error("Failed to map doctor profile");
    }
  });
