// infra/repositories/doctor.repository.ts
import { injectable } from "inversify";
import { randomUUID } from "crypto";
import { prismaTelemedicine } from "../../../prisma/prisma";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { OperationError } from "../../../../shared/entities/errors/commonError";

import {
  DoctorsListSchema,
  TDoctorsList,
} from "../../../../shared/entities/models/telemedicine/doctor-list";

injectable();
export class DoctorRepository /* implements IDoctorRepository */ {
  constructor() {}

  /**
   * Fetch doctors by orgId for appointment booking list (no filters).
   */
  async getDoctorsByOrg(orgId: string): Promise<TDoctorsList> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getDoctorsByOrgRepository",
      startTimeMs,
      context: { operationId, orgId },
    });

    try {
      const doctors = await prismaTelemedicine.doctor.findMany({
        where: { orgId, isCompleted: true, doctorType: "HUMAN" },
        orderBy: [{ ratingAverage: "desc" }, { createdAt: "desc" }],
        omit: {
          createdAt: true,
          updatedAt: true,
          updatedBy: true,
          createdBy: true,
          isABDMDoctorProfile: true,
          isCompleted: true,
          doctorId: true,
        },
        include: {
          personal: {
            select: {
              id: true,
              orgId: true,
              fullName: true,
              mobileNumber: true,
              gender: true,
              speciality: true,
            },
          },
          services: {
            select: {
              id: true,
              name: true,
              duration: true,
              priceAmount: true,
              priceCurrency: true,
              supportedModes: true, // JSON
            },
          },
          weeklyAvailabilities: {
            select: {
              id: true,
              dayOfWeek: true,
              isEnabled: true,
              slots: {
                select: { id: true, start: true, end: true },
                // you can limit here if list payload is large, e.g. `take: 6`
              },
            },
          },
        },
      });

      // map to a slim booking item
      const list = doctors.map((d) => ({
        id: d.userId!,
        orgId: d.orgId,
        fullName: d.personal?.fullName ?? "Doctor",
        gender: d.personal?.gender ?? null,
        ratingAverage: d.ratingAverage ?? 0,
        ratingCount: d.ratingCount ?? 0,
        mobileNumber: d.personal?.mobileNumber,
        speciality: d.personal?.speciality ?? "unknown",
        services:
          d.services?.map((s) => ({
            id: s.id,
            name: s.name,
            duration: s.duration,
            priceAmount: s.priceAmount ?? null,
            priceCurrency: s.priceCurrency ?? null,
            supportedModes: s.supportedModes,
          })) ?? [],
        weeklyAvailabilities:
          d.weeklyAvailabilities?.map((wa) => ({
            id: wa.id,
            dayOfWeek: wa.dayOfWeek,
            isEnabled: wa.isEnabled,
            slots: (wa.slots ?? []).map((s) => ({
              id: s.id,
              start: s.start,
              end: s.end,
            })),
          })) ?? [],
      }));

      const data = await DoctorsListSchema.parseAsync(list);

      logOperation("success", {
        name: "getDoctorsByOrgRepository",
        startTimeMs,
        context: { operationId, count: data.length },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getDoctorsByOrgRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
