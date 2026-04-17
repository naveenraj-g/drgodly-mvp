"use server";

import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import z from "zod";
import { createServerAction } from "zsa";

export const getUserForDoctorProfileMapping = createServerAction()
  .input(
    z.object({
      orgId: z.string().min(1),
    }),
  )
  .handler(async ({ input }) => {
    const { orgId } = input;

    try {
      const hdrs = await headers();
      const params = {
        orgId: orgId,
        rolename: "doctor",
      };

      const queryParams = new URLSearchParams(params).toString();
      const res = await fetch(
        `${process.env.BETTER_AUTH_URL}/api/admin/org-members?${queryParams}`,
        {
          method: "GET",
          headers: hdrs,
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch user for doctor profile mapping");
      }
      return data;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  });

export const mapDoctorProfile = createServerAction()
  .input(
    z.object({
      id: z.string().min(1),
      userId: z.string().min(1),
      orgId: z.string().min(1),
    }),
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
