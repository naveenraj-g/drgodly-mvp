"use server";

import z from "zod";
import {
  bookAppointmentController,
  bookConsultationAppointmentController,
  bookIntakeAppointmentController,
  cancelAppointmentController,
  completeConsultationController,
  confirmAppointmentController,
  deleteAppointmentController,
  getAppointmentForOnlineConsultationController,
  getAppointmentsForDoctorController,
  getAppointmentsForPatientController,
  getDoctorDashboardAppointmentsController,
  getPreviousCompletedReportController,
  rescheduleAppointmentController,
  TBookAppointmentControllerOutput,
  TBookConsultationAppointmentControllerOutput,
  TBookIntakeAppointmentControllerOutput,
  TCancelAppointmentControllerOutput,
  TCompleteConsultationControllerOutput,
  TConfirmAppointmentControllerOutput,
  TDeleteAppointmentControllerOutput,
  TGetAppointmentForOnlineConsultationControllerOutput,
  TGetAppointmentsForDoctorControllerOutput,
  TGetAppointmentsForPatientControllerOutput,
  TGetDoctorDashboardAppointmentsControllerOutput,
  TGetPreviousCompletedReportControllerOutput,
  TRescheduleAppointmentControllerOutput,
} from "@/modules/server/telemedicine/interface-adapters/controllers/appointment";
import {
  BookAppointmentValidationSchema,
  BookConsultationAppointmentValidationSchema,
  BookIntakeAppointmentValidationSchema,
  CancelAppointmentValidationSchema,
  CompleteConsultationValidationSchema,
  DeleteAppointmentValidationSchema,
  GetAppointmentValidationSchema,
  RescheduleAppointmentValidationSchema,
} from "@/modules/shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";
import {
  createFhirEncounter,
  createFhirQuestionnaireResponse,
  createFhirAppointmentWithEncounter,
  updateFhirAppointment,
} from "@/modules/server/fhir";
import { fhirRequest } from "@/modules/server/fhir/client";
import type {
  EncounterClass,
  FhirAppointmentCreatePayload,
} from "@/modules/server/fhir";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
import type {
  Prisma,
  ObservationStatus,
  MedicationRequestStatus,
  MedicationRequestIntent,
  ServiceRequestStatus,
  ServiceRequestIntent,
  ServiceRequestPriority,
} from "@/modules/server/prisma/generated/telemedicine-database";

// ── FHIR helpers ──────────────────────────────────────────────────────────────

function buildIsoDatetime(date: Date, timeStr: string): string {
  const d = new Date(date);
  const [h, m] = timeStr.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function addMinutes(isoStr: string, mins: number): string {
  return new Date(new Date(isoStr).getTime() + mins * 60_000).toISOString();
}

function toEncounterClass(mode: string): EncounterClass {
  return mode === "VIRTUAL" ? "virtual" : "ambulatory";
}

/**
 * Creates an Encounter and then an Appointment on the FHIR server.
 * Returns the encounter so callers can reference its id for QR sync.
 */
async function syncEncounterAndAppointment({
  startIso,
  endIso,
  encounterClass,
  description,
  patientDisplay,
  practitionerDisplay,
}: {
  startIso: string;
  endIso: string;
  encounterClass: EncounterClass;
  description?: string | null;
  patientDisplay?: string | null;
  practitionerDisplay?: string | null;
}) {
  const encounter = await createFhirEncounter({
    status: "planned",
    class_code: encounterClass,
    period_start: startIso,
    period_end: endIso,
  });

  const participants: FhirAppointmentCreatePayload["participant"] = [];
  if (patientDisplay) {
    participants.push({
      actor_display: patientDisplay,
      required: "required",
      status: "accepted",
    });
  }
  if (practitionerDisplay) {
    participants.push({
      actor_display: practitionerDisplay,
      type_text: "Attending Physician",
      required: "required",
      status: "accepted",
    });
  }
  if (participants.length === 0) {
    participants.push({ status: "needs-action" });
  }

  const appointmentPayload: FhirAppointmentCreatePayload = {
    status: "booked",
    encounter_id: Number(encounter.id),
    start: startIso,
    end: endIso,
    minutes_duration: 30,
    created: new Date().toISOString(),
    description: description ?? undefined,
    participant: participants,
  };

  await fhirRequest("POST", "/api/fhir/v1/appointments/", appointmentPayload);

  return encounter;
}

export const bookAppointment = createServerAction()
  .input(BookAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    let fhirEncounterId: number | undefined;
    let fhirAppointmentId: number | undefined;

    try {
      const [patientRecord, doctorRecord] = await Promise.all([
        prismaTelemedicine.patient.findUnique({
          where: {
            orgId_userId: { orgId: input.orgId, userId: input.patientUserId },
          },
          select: { fhirPatientId: true },
        }),
        prismaTelemedicine.doctor.findUnique({
          where: {
            orgId_userId: { orgId: input.orgId, userId: input.doctorUserId },
          },
          select: { fhirPractitionerId: true },
        }),
      ]);

      if (patientRecord?.fhirPatientId && doctorRecord?.fhirPractitionerId) {
        const startIso = buildIsoDatetime(
          new Date(input.appointmentDate),
          input.time,
        );
        const endIso = addMinutes(startIso, 30);
        const { encounter, appointment } =
          await createFhirAppointmentWithEncounter({
            fhirPatientId: String(patientRecord.fhirPatientId),
            fhirPractitionerId: String(doctorRecord.fhirPractitionerId),
            patientName: null,
            practitionerName: null,
            start: startIso,
            end: endIso,
            appointmentTypeMode:
              input.appointmentMode === "VIRTUAL" ? "virtual" : "in-person",
            description: input.note ?? undefined,
          });
        fhirEncounterId = Number(encounter.id);
        fhirAppointmentId = Number(appointment.id);
      }
    } catch (err) {
      console.error("[FHIR] bookAppointment pre-sync failed:", err);
    }

    return await withMonitoring<TBookAppointmentControllerOutput>(
      "bookAppointment",
      () =>
        bookAppointmentController(input, fhirEncounterId, fhirAppointmentId),
      {
        operationErrorMessage: "Failed to book appointment.",
      },
    );
  });

export const bookIntakeAppointment = createServerAction()
  .input(BookIntakeAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TBookIntakeAppointmentControllerOutput>(
      "bookAppointment",
      () => bookIntakeAppointmentController(input),
      {
        operationErrorMessage: "Failed to book intake appointment.",
      },
    );

    try {
      const startIso = new Date().toISOString();
      const endIso = addMinutes(startIso, 30);
      const encounter = await syncEncounterAndAppointment({
        startIso,
        endIso,
        encounterClass: "ambulatory",
        description: "Intake Appointment",
      });

      if (input.intakeConversation != null || input.intakeReport != null) {
        await createFhirQuestionnaireResponse({
          questionnaire:
            "http://drgodly.com/fhir/Questionnaire/intake-conversation",
          status: "completed",
          encounter: `Encounter/${encounter.id}`,
          authored: startIso,
          item: [
            {
              link_id: "1",
              text: "Intake Conversation",
              answer:
                input.intakeConversation != null
                  ? [{ value_string: JSON.stringify(input.intakeConversation) }]
                  : undefined,
            },
            {
              link_id: "2",
              text: "Intake Report",
              answer:
                input.intakeReport != null
                  ? [{ value_string: JSON.stringify(input.intakeReport) }]
                  : undefined,
            },
          ],
        });
      }
    } catch (err) {
      console.error("[FHIR] bookIntakeAppointment sync failed:", err);
    }

    return result;
  });

export const getPatientAppointments = createServerAction()
  .input(GetAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetAppointmentsForPatientControllerOutput>(
      "getPatientAppointments",
      () => getAppointmentsForPatientController(input),
      {
        operationErrorMessage: "Failed to get appointments.",
      },
    );
  });

export const getDoctorAppointments = createServerAction()
  .input(GetAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetAppointmentsForDoctorControllerOutput>(
      "getDoctorAppointments",
      () => getAppointmentsForDoctorController(input),
      {
        operationErrorMessage: "Failed to get appointments.",
      },
    );
  });

export const getDoctorDashboardAppointments = createServerAction()
  .input(GetAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetDoctorDashboardAppointmentsControllerOutput>(
      "getDoctorDashboardAppointments",
      () => getDoctorDashboardAppointmentsController(input),
      {
        operationErrorMessage: "Failed to get dashboard appointments.",
      },
    );
  });

export const getAppointmentForOnlineConsultation = createServerAction()
  .input(DeleteAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetAppointmentForOnlineConsultationControllerOutput>(
      "getAppointmentForOnlineConsultation",
      () => getAppointmentForOnlineConsultationController(input),
      {
        operationErrorMessage: "Failed to get appointment.",
      },
    );
  });

export const rescheduleAppointment = createServerAction()
  .input(RescheduleAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TRescheduleAppointmentControllerOutput>(
      "rescheduleAppointment",
      () => rescheduleAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to reschedule appointment.",
      },
    );

    try {
      if (result.fhirAppointmentId) {
        const startIso = buildIsoDatetime(
          new Date(input.appointmentDate),
          input.time,
        );
        const endIso = addMinutes(startIso, 30);
        await updateFhirAppointment(String(result.fhirAppointmentId), {
          status: "booked",
          start: startIso,
          end: endIso,
        });
      }
    } catch (err) {
      console.error("[FHIR] rescheduleAppointment sync failed:", err);
    }

    return result;
  });

export const cancelAppointment = createServerAction()
  .input(CancelAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TCancelAppointmentControllerOutput>(
      "cancelAppointment",
      () => cancelAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to cancel appointment.",
      },
    );

    try {
      if (result.fhirAppointmentId) {
        await updateFhirAppointment(String(result.fhirAppointmentId), {
          status: "cancelled",
          cancellation_reason: result.cancelReason ?? undefined,
          cancellation_date: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("[FHIR] cancelAppointment sync failed:", err);
    }

    return result;
  });

export const deleteAppointment = createServerAction()
  .input(DeleteAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TDeleteAppointmentControllerOutput>(
      "deleteAppointment",
      () => deleteAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to delete appointment.",
      },
    );
  });

export const bookConsultationAppointment = createServerAction()
  .input(BookConsultationAppointmentValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    const result =
      await withMonitoring<TBookConsultationAppointmentControllerOutput>(
        "bookConsultationAppointment",
        () => bookConsultationAppointmentController(input),
        {
          operationErrorMessage: "Failed to book consultation appointment.",
        },
      );

    try {
      const startIso = new Date().toISOString();
      const endIso = addMinutes(startIso, 30);
      const encounter = await syncEncounterAndAppointment({
        startIso,
        endIso,
        encounterClass: "virtual",
        description: "AI Consultation",
      });

      if (input.virtualConversation != null) {
        await createFhirQuestionnaireResponse({
          questionnaire:
            "http://drgodly.com/fhir/Questionnaire/virtual-consultation",
          status: "completed",
          encounter: `Encounter/${encounter.id}`,
          authored: startIso,
          item: [
            {
              link_id: "1",
              text: "Virtual Consultation Conversation",
              answer: [
                { value_string: JSON.stringify(input.virtualConversation) },
              ],
            },
          ],
        });
      }
    } catch (err) {
      console.error("[FHIR] bookConsultationAppointment sync failed:", err);
    }

    return result;
  });

export const confirmAppointment = createServerAction()
  .input(DeleteAppointmentValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TConfirmAppointmentControllerOutput>(
      "deleteAppointment",
      () => confirmAppointmentController(input),
      {
        revalidatePath: true,
        url: "/bezs/telemedicine/patient/appointments",
        operationErrorMessage: "Failed to confirm appointment.",
      },
    );
  });

export const getPreviousConsultationReport = createServerAction()
  .input(
    z.object({
      patientUserId: z.string().min(1),
      orgId: z.string().min(1),
      excludeAppointmentId: z.string().min(1),
    }),
    { skipInputParsing: true },
  )
  .handler(async ({ input }) => {
    return await withMonitoring<TGetPreviousCompletedReportControllerOutput>(
      "getPreviousConsultationReport",
      () => getPreviousCompletedReportController(input),
      {
        operationErrorMessage: "Failed to fetch previous consultation report.",
      },
    );
  });

export const completeConsultation = createServerAction()
  .input(CompleteConsultationValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TCompleteConsultationControllerOutput>(
      "completeConsultation",
      () => completeConsultationController(input),
      {
        operationErrorMessage: "Failed to complete consultation.",
      },
    );
  });

export async function getPatientAppointmentView(appointmentId: string) {
  return prismaTelemedicine.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      id: true,
      appointmentDate: true,
      patient: { select: { personal: { select: { name: true } } } },
      doctor: { select: { personal: { select: { fullName: true } } } },
      appointmentActual: { select: { doctorReport: true } },
      conditions: {
        where: { isDoctorAccepted: true },
        select: {
          id: true,
          codeDisplay: true,
          codeCode: true,
          codeSystem: true,
          clinicalStatusCode: true,
          verificationStatusCode: true,
        },
      },
      observations: {
        where: { isDoctorAccepted: true },
        select: {
          id: true,
          codeDisplay: true,
          codeCode: true,
          status: true,
          valueString: true,
          valueQuantityValue: true,
          valueQuantityUnit: true,
          valueBoolean: true,
          valueInteger: true,
        },
      },
      medicationRequests: {
        where: { isDoctorAccepted: true },
        select: {
          id: true,
          medicationCodeDisplay: true,
          medicationCodeCode: true,
          status: true,
          intent: true,
          dosageInstructions: {
            select: { text: true, routeDisplay: true, routeText: true },
          },
        },
      },
      serviceRequests: {
        where: { isDoctorAccepted: true },
        select: {
          id: true,
          codeDisplay: true,
          codeCode: true,
          status: true,
          intent: true,
          priority: true,
        },
      },
    },
  });
}

export async function getAppointmentReview(appointmentId: string) {
  return prismaTelemedicine.appointmentActual.findUnique({
    where: { appointmentId },
    select: {
      doctorReport: true,
      fullReport: true,
      appointment: {
        select: {
          id: true,
          orgId: true,
          appointmentDate: true,
          patient: {
            select: { personal: { select: { name: true } } },
          },
          doctor: {
            select: { personal: { select: { fullName: true } } },
          },
          conditions: {
            where: { isDoctorAccepted: true },
            select: {
              id: true,
              codeSystem: true,
              codeCode: true,
              codeDisplay: true,
              codeText: true,
              clinicalStatusCode: true,
              verificationStatusCode: true,
            },
          },
          observations: {
            where: { isDoctorAccepted: true },
            select: {
              id: true,
              codeSystem: true,
              codeCode: true,
              codeDisplay: true,
              codeText: true,
              status: true,
              valueString: true,
              valueQuantityValue: true,
              valueQuantityUnit: true,
            },
          },
          medicationRequests: {
            where: { isDoctorAccepted: true },
            select: {
              id: true,
              medicationCodeSystem: true,
              medicationCodeCode: true,
              medicationCodeDisplay: true,
              medicationCodeText: true,
              status: true,
              intent: true,
              dosageInstructions: {
                select: { text: true, routeDisplay: true, routeText: true },
              },
            },
          },
          serviceRequests: {
            where: { isDoctorAccepted: true },
            select: {
              id: true,
              codeSystem: true,
              codeCode: true,
              codeDisplay: true,
              codeText: true,
              status: true,
              intent: true,
              priority: true,
            },
          },
        },
      },
    },
  });
}

export const getBookedSlotsForDoctor = createServerAction()
  .input(
    z.object({
      doctorUserId: z.string().min(1),
      orgId: z.string().min(1),
      date: z.string().min(1), // ISO date string
    }),
    { skipInputParsing: true },
  )
  .handler(async ({ input }) => {
    const day = new Date(input.date);
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    const doctor = await prismaTelemedicine.doctor.findUnique({
      where: {
        orgId_userId: { orgId: input.orgId, userId: input.doctorUserId },
      },
      select: { id: true },
    });

    if (!doctor) return [] as string[];

    const appointments = await prismaTelemedicine.appointment.findMany({
      where: {
        orgId: input.orgId,
        doctorId: doctor.id,
        appointmentDate: { gte: startOfDay, lte: endOfDay },
        status: { in: ["PENDING", "SCHEDULED", "RESCHEDULED"] },
        isDoctorDeleted: false,
      },
      select: { time: true },
    });

    return appointments.map((a) => a.time);
  });

// ── Submit Clinical Review ────────────────────────────────────────────────────

function toFhirEnum(code: string): string {
  return code.toUpperCase().replace(/-/g, "_");
}

interface ClinicalReviewInput {
  appointmentId: string;
  userId: string;
  soap: Record<string, unknown>;
  conditions: Array<{
    display: string;
    terminologySystem?: string | null;
    resolved?: {
      system: string;
      code: string;
      display: string;
      text: string;
    } | null;
    clinicalStatus?: string | null;
    verificationStatus?: string | null;
  }>;
  observations: Array<{
    display: string;
    terminologySystem?: string | null;
    value?: string | null;
    unit?: string | null;
    resolved?: {
      system: string;
      code: string;
      display: string;
      text: string;
    } | null;
    status?: string | null;
    editedValue?: string | null;
    editedUnit?: string | null;
  }>;
  medications: Array<{
    display: string;
    terminologySystem?: string | null;
    dose?: string | null;
    frequency?: string | null;
    duration?: string | null;
    route?: string | null;
    resolved?: {
      system: string;
      code: string;
      display: string;
      text: string;
    } | null;
    status?: string | null;
    intent?: string | null;
    editedDose?: string | null;
    editedFrequency?: string | null;
    editedDuration?: string | null;
    editedRoute?: string | null;
  }>;
  serviceRequests: Array<{
    display: string;
    terminologySystem?: string | null;
    resolved?: {
      system: string;
      code: string;
      display: string;
      text: string;
    } | null;
    status?: string | null;
    intent?: string | null;
    priority?: string | null;
  }>;
}

export async function submitClinicalReview(input: ClinicalReviewInput) {
  const appt = await prismaTelemedicine.appointment.findUnique({
    where: { id: input.appointmentId },
    select: { orgId: true },
  });
  if (!appt) throw new Error("Appointment not found");
  const { orgId } = appt;

  await prismaTelemedicine.$transaction(async (tx) => {
    // 1. Persist the edited SOAP as the canonical doctor report
    await tx.appointmentActual.upsert({
      where: { appointmentId: input.appointmentId },
      create: {
        appointmentId: input.appointmentId,
        orgId,
        doctorReport: input.soap as unknown as Prisma.InputJsonValue,
        createdBy: input.userId,
        updatedBy: input.userId,
      },
      update: {
        doctorReport: input.soap as unknown as Prisma.InputJsonValue,
        updatedBy: input.userId,
      },
    });

    // 2. Replace prior FHIR records (idempotent re-save)
    await tx.condition.deleteMany({
      where: { appointmentId: input.appointmentId },
    });
    await tx.observation.deleteMany({
      where: { appointmentId: input.appointmentId },
    });
    await tx.medicationRequest.deleteMany({
      where: { appointmentId: input.appointmentId },
    });
    await tx.serviceRequest.deleteMany({
      where: { appointmentId: input.appointmentId },
    });

    // 3. Conditions
    for (const c of input.conditions) {
      await tx.condition.create({
        data: {
          appointmentId: input.appointmentId,
          orgId,
          isDoctorAccepted: true,
          codeSystem: c.resolved?.system ?? null,
          codeCode: c.resolved?.code ?? null,
          codeDisplay: c.resolved?.display ?? c.display,
          codeText: c.resolved?.text ?? c.display,
          clinicalStatusCode: c.clinicalStatus ?? null,
          verificationStatusCode: c.verificationStatus ?? null,
        },
      });
    }

    // 4. Observations — store numeric values in valueQuantityValue, strings in valueString
    for (const o of input.observations) {
      const rawValue = o.editedValue ?? o.value ?? null;
      const unit = o.editedUnit ?? o.unit ?? null;
      const numVal = rawValue !== null ? parseFloat(rawValue) : NaN;
      const isNumeric = rawValue !== null && !isNaN(numVal);

      await tx.observation.create({
        data: {
          appointmentId: input.appointmentId,
          orgId,
          isDoctorAccepted: true,
          status: toFhirEnum(o.status ?? "final") as ObservationStatus,
          codeSystem: o.resolved?.system ?? null,
          codeCode: o.resolved?.code ?? null,
          codeDisplay: o.resolved?.display ?? o.display,
          codeText: o.resolved?.text ?? o.display,
          ...(isNumeric
            ? { valueQuantityValue: numVal, valueQuantityUnit: unit }
            : { valueString: rawValue }),
        },
      });
    }

    // 5. Medication requests with nested dosage instructions
    for (const m of input.medications) {
      const doseParts = [
        m.editedDose ?? m.dose,
        m.editedFrequency ?? m.frequency,
        m.editedDuration ?? m.duration,
      ].filter((x): x is string => Boolean(x));
      const routeText = m.editedRoute ?? m.route ?? null;
      const dosageText = doseParts.join(", ") || null;

      await tx.medicationRequest.create({
        data: {
          appointmentId: input.appointmentId,
          orgId,
          isDoctorAccepted: true,
          status: toFhirEnum(m.status ?? "active") as MedicationRequestStatus,
          intent: toFhirEnum(m.intent ?? "order") as MedicationRequestIntent,
          medicationCodeSystem: m.resolved?.system ?? null,
          medicationCodeCode: m.resolved?.code ?? null,
          medicationCodeDisplay: m.resolved?.display ?? m.display,
          medicationCodeText: m.resolved?.text ?? m.display,
          ...((dosageText ?? routeText)
            ? {
                dosageInstructions: {
                  create: [
                    { text: dosageText, routeDisplay: routeText, routeText },
                  ],
                },
              }
            : {}),
        },
      });
    }

    // 6. Service requests
    for (const s of input.serviceRequests) {
      await tx.serviceRequest.create({
        data: {
          appointmentId: input.appointmentId,
          orgId,
          isDoctorAccepted: true,
          status: toFhirEnum(s.status ?? "active") as ServiceRequestStatus,
          intent: toFhirEnum(s.intent ?? "order") as ServiceRequestIntent,
          priority: s.priority
            ? (toFhirEnum(s.priority) as ServiceRequestPriority)
            : null,
          codeSystem: s.resolved?.system ?? null,
          codeCode: s.resolved?.code ?? null,
          codeDisplay: s.resolved?.display ?? s.display,
          codeText: s.resolved?.text ?? s.display,
        },
      });
    }
  });
}

// ── Re-extract clinical data from an edited SOAP note ────────────────────────

export interface ClinicalExtractionResult {
  conditions: Array<{ display: string; terminologySystem: string }>;
  observations: Array<{
    display: string;
    terminologySystem: string;
    value?: string | null;
    unit?: string | null;
  }>;
  medicationRequests: Array<{
    display: string;
    terminologySystem: string;
    dose?: string | null;
    frequency?: string | null;
    duration?: string | null;
    route?: string | null;
  }>;
  serviceRequests: Array<{ display: string; terminologySystem: string }>;
}

export async function extractClinicalFromSoap(
  soap: Record<string, unknown>,
): Promise<ClinicalExtractionResult> {
  const url = process.env.AGENT_CLINICAL_API_URL;
  if (!url) throw new Error("AGENT_CLINICAL_API_URL is not configured");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ soap }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Clinical extraction agent error ${res.status}: ${text}`);
  }

  return res.json() as Promise<ClinicalExtractionResult>;
}
