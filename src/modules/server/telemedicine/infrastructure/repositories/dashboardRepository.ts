import { randomUUID } from "crypto";
import { IDashboardRepository } from "../../application/repositories/dashboardRepository.interface";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { prismaTelemedicine } from "../../../prisma/prisma";
import {
  DashboardAppointmentsSchema,
  TAppointments,
  TGetDashboardAppointmentsDataPayload,
} from "../../../../shared/entities/models/telemedicine/dashboard";

export class DashboardRepository implements IDashboardRepository {
  constructor() {}

  async getDashboardAppointmentsData(
    payload: TGetDashboardAppointmentsDataPayload
  ): Promise<TAppointments> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getPatientDashboardDataRepository",
      startTimeMs,
      context: { operationId },
    });

    const { orgId, patientId, doctorId } = payload;

    try {
      const whereCondition = {
        orgId,
        ...(patientId ? { patientId } : {}),
        ...(doctorId ? { doctorId } : {}),
      };

      const dashboardData = await prismaTelemedicine.$transaction(
        async (tx) => {
          const appointments = await tx.appointment.findMany({
            where: {
              ...whereCondition,
              appointmentMode: {
                not: "INTAKE",
              },
            },
            include: {
              doctor: {
                select: {
                  userId: true,
                  orgId: true,
                  personal: {
                    select: {
                      id: true,
                      fullName: true,
                      orgId: true,
                      gender: true,
                    },
                  },
                },
              },
              patient: {
                select: {
                  orgId: true,
                  userId: true,
                  personal: {
                    select: {
                      id: true,
                      orgId: true,
                      name: true,
                      gender: true,
                    },
                  },
                },
              },
            },
            omit: {
              patientId: true,
              doctorId: true,
            },
            orderBy: {
              appointmentDate: "desc",
            },
          });

          return appointments;
        }
      );

      const parsedData = await DashboardAppointmentsSchema.parseAsync(
        dashboardData
      );

      logOperation("success", {
        name: "getPatientDashboardDataRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsedData;
    } catch (error) {
      logOperation("error", {
        name: "getPatientDashboardDataRepository",
        startTimeMs,
        err: error,
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }

      throw new OperationError("Failed to fetch patient dashboard data", {
        cause: error,
      });
    }
  }
}
