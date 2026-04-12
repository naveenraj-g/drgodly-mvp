// modules/telemedicine/infrastructure/repositories/weeklyAvailability.repository.ts
import { injectable } from "inversify";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import { prismaTelemedicine } from "../../../prisma/prisma";

import { IDoctorWeeklyAvailabilityRepository } from "../../application/repositories/doctorWeeklyAvailabilityRepository.interface";

import {
  WeeklyAvailabilityPublicSchema,
  WeeklyAvailabilitiesPublicSchema,
  TWeeklyAvailabilityCreate,
  TWeeklyAvailabilityUpdate,
  TWeeklyAvailabilityPublic,
  TWeeklyAvailabilitiesPublic,
  TWeeklySchedulePayload,
} from "../../../../shared/entities/models/telemedicine/weeklyAvailability";

injectable();
export class DoctorWeeklyAvailabilityRepository
  implements IDoctorWeeklyAvailabilityRepository
{
  constructor() {}

  // ---------- Create one day ----------
  async createDayAvailability(
    data: TWeeklyAvailabilityCreate
  ): Promise<TWeeklyAvailabilityPublic> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "createDayAvailabilityRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      //   const payload = await WeeklyAvailabilityCreateSchema.parseAsync(data);
      const { operationBy, slots, ...rest } = data;

      // unique per org+doctor+day
      const created = await prismaTelemedicine.weeklyAvailability.create({
        data: {
          ...rest,
          createdBy: operationBy,
          updatedBy: operationBy,
          // nested slots
          ...(slots.length
            ? {
                slots: {
                  create: slots.map((s) => ({
                    orgId: rest.orgId,
                    start: s.start,
                    end: s.end,
                    createdBy: operationBy,
                    updatedBy: operationBy,
                  })),
                },
              }
            : {}),
        },
        include: { slots: true },
      });

      const parsed = await WeeklyAvailabilityPublicSchema.parseAsync(created);
      logOperation("success", {
        name: "createDayAvailabilityRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "createDayAvailabilityRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  // ---------- Get full week for a doctor ----------
  async getDoctorWeeklyAvailability(
    orgId: string,
    doctorId: string
  ): Promise<TWeeklyAvailabilitiesPublic> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();
    logOperation("start", {
      name: "getDoctorWeekRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const week = await prismaTelemedicine.weeklyAvailability.findMany({
        where: { orgId, doctorId },
        include: { slots: true },
        orderBy: { dayOfWeek: "asc" },
      });

      const parsed = await WeeklyAvailabilitiesPublicSchema.parseAsync(week);

      logOperation("success", {
        name: "getDoctorWeekRepository",
        startTimeMs,
        context: { operationId },
      });

      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "getDoctorWeekRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  // ---------- Update one day (replace slots if provided) ----------
  async updateDayAvailability(
    data: TWeeklyAvailabilityUpdate
  ): Promise<TWeeklyAvailabilityPublic> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();
    logOperation("start", {
      name: "updateDayAvailabilityRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      //   const payload = await WeeklyAvailabilityUpdateSchema.parseAsync(data);
      const { operationBy, id, slots, ...rest } = data;

      const updated = await prismaTelemedicine.$transaction(async (tx) => {
        const parent = await tx.weeklyAvailability.update({
          where: { id, orgId: rest.orgId, doctorId: rest.doctorId },
          data: {
            dayOfWeek: rest.dayOfWeek,
            updatedBy: operationBy,
          },
        });

        if (slots) {
          await tx.availabilitySlot.deleteMany({
            where: { weeklyAvailabilityId: parent.id },
          });

          if (slots.length) {
            await tx.availabilitySlot.createMany({
              data: slots.map((s) => ({
                orgId: parent.orgId,
                start: s.start,
                end: s.end,
                weeklyAvailabilityId: parent.id,
                createdBy: operationBy,
                updatedBy: operationBy,
              })),
            });
          }
        }

        return tx.weeklyAvailability.findUniqueOrThrow({
          where: { id: parent.id },
          include: { slots: true },
        });
      });

      const parsed = await WeeklyAvailabilityPublicSchema.parseAsync(updated);
      logOperation("success", {
        name: "updateDayAvailabilityRepository",
        startTimeMs,
        context: { operationId },
      });
      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "updateDayAvailabilityRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });
      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  // ---------- Delete one day ----------
  async deleteDayAvailability(
    orgId: string,
    doctorId: string,
    dayOfWeek: string
  ): Promise<TWeeklyAvailabilityPublic> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();
    logOperation("start", {
      name: "deleteDayAvailabilityRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const deleted = await prismaTelemedicine.weeklyAvailability.delete({
        where: {
          orgId_doctorId_dayOfWeek: { orgId, doctorId, dayOfWeek },
        },
        include: { slots: true },
      });

      const parsed = await WeeklyAvailabilityPublicSchema.parseAsync(deleted);
      logOperation("success", {
        name: "deleteDayAvailabilityRepository",
        startTimeMs,
        context: { operationId },
      });
      return parsed;
    } catch (error) {
      logOperation("error", {
        name: "deleteDayAvailabilityRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });
      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  // ---------- Upsert full week (7 entries) ----------
  async upsertFullWeek(
    orgId: string,
    doctorId: string,
    payload: TWeeklySchedulePayload,
    operationBy: string
  ): Promise<TWeeklyAvailabilitiesPublic> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();
    logOperation("start", {
      name: "upsertFullWeekRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const result = await prismaTelemedicine.$transaction(async (tx) => {
        // For each day: if isEnabled -> upsert parent & replace slots
        // if not enabled -> delete parent if exists
        for (const day of payload) {
          const parent = await tx.weeklyAvailability.upsert({
            where: {
              orgId_doctorId_dayOfWeek: {
                orgId,
                doctorId,
                dayOfWeek: day.dayOfWeek,
              },
            },
            create: {
              orgId,
              doctorId,
              isEnabled: day.isEnabled,
              dayOfWeek: day.dayOfWeek,
              createdBy: operationBy,
              updatedBy: operationBy,
            },
            update: {
              isEnabled: day.isEnabled,
              updatedBy: operationBy,
            },
            select: { id: true, orgId: true },
          });

          // 2) Only touch slots if the client explicitly sent a slots array
          //    - If slots is undefined -> preserve existing slots (even when disabling)
          //    - If slots is [] or [...], replace with the provided array
          if (Array.isArray(day.slots)) {
            await tx.availabilitySlot.deleteMany({
              where: { weeklyAvailabilityId: parent.id, orgId },
            });

            if (day.slots.length > 0) {
              await tx.availabilitySlot.createMany({
                data: day.slots.map((s) => ({
                  orgId,
                  start: s.start,
                  end: s.end,
                  weeklyAvailabilityId: parent.id,
                  createdBy: operationBy,
                  updatedBy: operationBy,
                })),
              });
            }
          }
        }

        return tx.weeklyAvailability.findMany({
          where: { orgId, doctorId },
          include: { slots: true },
          orderBy: { dayOfWeek: "asc" },
        });
      });

      const week = await WeeklyAvailabilitiesPublicSchema.parseAsync(result);

      logOperation("success", {
        name: "upsertFullWeekRepository",
        startTimeMs,
        context: { operationId },
      });

      return week;
    } catch (error) {
      logOperation("error", {
        name: "upsertFullWeekRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });

      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  /** Bulk CREATE: wipe existing records for the doctor/org, then create enabled days + slots */
  async createFullWeek(
    orgId: string,
    doctorId: string,
    payload: TWeeklySchedulePayload,
    operationBy: string
  ): Promise<TWeeklyAvailabilitiesPublic> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();
    logOperation("start", {
      name: "createFullWeekRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const result = await prismaTelemedicine.$transaction(async (tx) => {
        // 1) Clear existing week for this doctor/org (parent + slots via cascade)
        await tx.availabilitySlot.deleteMany({
          where: { weeklyAvailability: { orgId, doctorId } },
        });
        await tx.weeklyAvailability.deleteMany({
          where: { orgId, doctorId },
        });

        // 2) Create only enabled days + slots
        for (const day of payload) {
          if (!day.isEnabled) continue;

          const parent = await tx.weeklyAvailability.create({
            data: {
              orgId,
              doctorId,
              isEnabled: day.isEnabled,
              dayOfWeek: day.dayOfWeek,
              createdBy: operationBy,
              updatedBy: operationBy,
            },
            select: { id: true },
          });

          if (day.slots.length) {
            await tx.availabilitySlot.createMany({
              data: day.slots.map((s) => ({
                orgId,
                start: s.start,
                end: s.end,
                weeklyAvailabilityId: parent.id,
                createdBy: operationBy,
                updatedBy: operationBy,
              })),
            });
          }
        }

        return tx.weeklyAvailability.findMany({
          where: { orgId, doctorId },
          include: { slots: true },
          orderBy: { dayOfWeek: "asc" },
        });
      });

      const week = await WeeklyAvailabilitiesPublicSchema.parseAsync(result);
      logOperation("success", {
        name: "createFullWeekRepository",
        startTimeMs,
        context: { operationId },
      });
      return week;
    } catch (error) {
      logOperation("error", {
        name: "createFullWeekRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });
      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  /** Bulk UPDATE: upsert enabled days (replace slots), delete disabled days */
  async updateFullWeek(
    orgId: string,
    doctorId: string,
    payload: TWeeklySchedulePayload,
    operationBy: string
  ): Promise<TWeeklyAvailabilitiesPublic> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();
    logOperation("start", {
      name: "updateFullWeekRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const result = await prismaTelemedicine.$transaction(async (tx) => {
        for (const day of payload) {
          if (day.isEnabled) {
            // Upsert parent
            const parent = await tx.weeklyAvailability.upsert({
              where: {
                orgId_doctorId_dayOfWeek: {
                  orgId,
                  doctorId,
                  dayOfWeek: day.dayOfWeek,
                },
              },
              create: {
                orgId,
                doctorId,
                dayOfWeek: day.dayOfWeek,
                isEnabled: day.isEnabled,
                createdBy: operationBy,
                updatedBy: operationBy,
              },
              update: {
                isEnabled: day.isEnabled,
                updatedBy: operationBy,
              },
              select: { id: true },
            });

            // Replace slots
            await tx.availabilitySlot.deleteMany({
              where: { weeklyAvailabilityId: parent.id },
            });

            if (day.slots.length) {
              await tx.availabilitySlot.createMany({
                data: day.slots.map((s) => ({
                  orgId,
                  start: s.start,
                  end: s.end,
                  weeklyAvailabilityId: parent.id,
                  createdBy: operationBy,
                  updatedBy: operationBy,
                })),
              });
            }
          } else {
            // Disabled day: delete if exists (slots cascade by FK or explicitly)
            await tx.availabilitySlot.deleteMany({
              where: {
                weeklyAvailability: {
                  orgId,
                  doctorId,
                  dayOfWeek: day.dayOfWeek,
                },
              },
            });
            await tx.weeklyAvailability
              .delete({
                where: {
                  orgId_doctorId_dayOfWeek: {
                    orgId,
                    doctorId,
                    dayOfWeek: day.dayOfWeek,
                  },
                },
              })
              .catch(() => {});
          }
        }

        return tx.weeklyAvailability.findMany({
          where: { orgId, doctorId },
          include: { slots: true },
          orderBy: { dayOfWeek: "asc" },
        });
      });

      const week = await WeeklyAvailabilitiesPublicSchema.parseAsync(result);
      logOperation("success", {
        name: "updateFullWeekRepository",
        startTimeMs,
        context: { operationId },
      });
      return week;
    } catch (error) {
      logOperation("error", {
        name: "updateFullWeekRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });
      if (error instanceof Error)
        throw new OperationError(error.message, { cause: error });
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
