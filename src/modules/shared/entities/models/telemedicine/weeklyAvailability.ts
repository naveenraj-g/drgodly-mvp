// shared/entities/models/telemedicine/availability.ts
import z from "zod";

// DayOfWeek — keep as string union since your Prisma model stores string
export const DayOfWeekSchema = z.enum([
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]);

// ---------- Slot ----------
export const AvailabilitySlotEntitySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  start: z.string(),
  end: z.string(),
  weeklyAvailabilityId: z.string().uuid(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// base schema without effects so we can call .omit() on it
export const AvailabilitySlotBaseSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  start: z.string(),
  end: z.string(),
  weeklyAvailabilityId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// refined schema for runtime validation
export const AvailabilitySlotSchema = AvailabilitySlotBaseSchema.refine(
  (s) => s.start < s.end,
  {
    message: "Slot start must be before end",
    path: ["end"],
  }
);

export const AvailabilitySlotsSchema = z.array(AvailabilitySlotSchema);

export type TAvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
export type TAvailabilitySlots = z.infer<typeof AvailabilitySlotsSchema>;

export const AvailabilitySlotCreateSchema = AvailabilitySlotBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend(
  z.object({
    operationBy: z.string(),
  }).shape
);

export const AvailabilitySlotUpdateSchema = AvailabilitySlotBaseSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend(
  z.object({
    operationBy: z.string(),
  }).shape
);

export type TAvailabilitySlotCreate = z.infer<
  typeof AvailabilitySlotCreateSchema
>;
export type TAvailabilitySlotUpdate = z.infer<
  typeof AvailabilitySlotUpdateSchema
>;

// ---------- WeeklyAvailability ----------
export const WeeklyAvailabilityEntitySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  dayOfWeek: DayOfWeekSchema,
  isEnabled: z.boolean(),
  doctorId: z.string(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const WeeklyAvailabilitySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  dayOfWeek: DayOfWeekSchema,
  isEnabled: z.boolean(),
  doctorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // include slots when you need the full view
  slots: AvailabilitySlotsSchema.default([]),
});

export const WeeklyAvailabilitiesSchema = z.array(WeeklyAvailabilitySchema);

export type TWeeklyAvailability = z.infer<typeof WeeklyAvailabilitySchema>;
export type TWeeklyAvailabilities = z.infer<typeof WeeklyAvailabilitiesSchema>;

export const WeeklyAvailabilityPublicSchema = WeeklyAvailabilitySchema.omit({
  doctorId: true,
});
export const WeeklyAvailabilitiesPublicSchema = z.array(
  WeeklyAvailabilityPublicSchema
);

export type TWeeklyAvailabilityPublic = z.infer<
  typeof WeeklyAvailabilityPublicSchema
>;
export type TWeeklyAvailabilitiesPublic = z.infer<
  typeof WeeklyAvailabilitiesPublicSchema
>;

export const WeeklyAvailabilityCreateSchema = WeeklyAvailabilitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  slots: true,
}).extend(
  z.object({
    // accept child slots in the create payload
    slots: z
      .array(
        z
          .object({
            start: z.string(),
            end: z.string(),
          })
          .refine((s) => Number(s.start) < Number(s.end), {
            message: "Slot start must be before end",
            path: ["end"],
          })
      )
      .default([]),
    operationBy: z.string(),
  }).shape
);

export const WeeklyAvailabilityUpdateSchema = WeeklyAvailabilitySchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend(
  z.object({
    // allow replacing slots on update (we replace all for that day)
    slots: z
      .array(
        z
          .object({
            start: z.string(),
            end: z.string(),
          })
          .refine((s) => s.start < s.end, {
            message: "Slot start must be before end",
            path: ["end"],
          })
      )
      .optional(),
    operationBy: z.string(),
  }).shape
);

export type TWeeklyAvailabilityCreate = z.infer<
  typeof WeeklyAvailabilityCreateSchema
>;
export type TWeeklyAvailabilityUpdate = z.infer<
  typeof WeeklyAvailabilityUpdateSchema
>;

// Convenience type for a full week payload from UI
export const WeeklySchedulePayloadSchema = z
  .array(
    z.object({
      dayOfWeek: DayOfWeekSchema,
      isEnabled: z.boolean(),
      slots: z
        .array(
          z
            .object({
              start: z.string(),
              end: z.string(),
            })
            .refine((s) => s.start < s.end, {
              message: "Slot start must be before end",
              path: ["end"],
            })
        )
        .default([]),
    })
  )
  .length(7, "Must provide 7 days");

export type TWeeklySchedulePayload = z.infer<
  typeof WeeklySchedulePayloadSchema
>;
