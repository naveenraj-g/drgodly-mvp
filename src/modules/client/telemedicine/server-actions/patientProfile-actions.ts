"use server";

import {
  createorUpdatePatientPersonalDetailsController,
  createPatientInitialProfileController,
  getPatientWithPersonalProfileController,
  TCreateOrUpdatePatientPersonalDetailsOutput,
  TCreatePatientInitialProfileOutput,
  TGetPatientWithPersonalProfileOutput,
} from "@/modules/server/telemedicine/interface-adapters/controllers/patientProfile";
import {
  CreatePatientInitialProfileSchema,
  GetPatientWithPersonalProfileSchema,
  PatientProfileCreateOrUpdateValidationSchema,
} from "@/modules/shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";
import { createFhirPatient, updateFhirPatient } from "@/modules/server/fhir";
import { prismaTelemedicine } from "@/modules/server/prisma/prisma";

// ── FHIR mapping helpers ──────────────────────────────────────────────────────

function parseName(fullName: string): {
  given_name: string;
  family_name?: string;
} {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { given_name: parts[0] };
  return {
    given_name: parts.slice(0, -1).join(" "),
    family_name: parts[parts.length - 1],
  };
}

function toFhirDate(d: Date | string): string {
  return new Date(d).toISOString().split("T")[0];
}

function toFhirGender(
  g: "MALE" | "FEMALE" | "OTHER",
): "male" | "female" | "other" {
  return g.toLowerCase() as "male" | "female" | "other";
}

// ─────────────────────────────────────────────────────────────────────────────

export const getPatientWithPersonalProfile = createServerAction()
  .input(GetPatientWithPersonalProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetPatientWithPersonalProfileOutput>(
      "getPatientWithPersonalProfile",
      () => getPatientWithPersonalProfileController(input),
      {
        operationErrorMessage: "Failed to get profile datas.",
      },
    );
  });

export const createPatientInitialProfile = createServerAction()
  .input(CreatePatientInitialProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    // Push to FHIR first, get the assigned patient ID
    let fhirPatientId: number | undefined;
    try {
      const fhirPatient = await createFhirPatient({ active: true });
      fhirPatientId = Number(fhirPatient.id);
    } catch (err) {
      console.error("[FHIR] createPatientInitialProfile sync failed:", err);
    }

    return await withMonitoring<TCreatePatientInitialProfileOutput>(
      "createPatientInitialProfile",
      () => createPatientInitialProfileController(input, fhirPatientId),
      {
        url: "/bezs/telemedicine/patient/profile",
        revalidatePath: true,
        operationErrorMessage: "Failed to create initial profile.",
      },
    );
  });

export const createorUpdatePatientPersonalDetails = createServerAction()
  .input(PatientProfileCreateOrUpdateValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    const isUpdate = Boolean(input.id);

    // For updates, look up the existing fhirPatientId to patch rather than create
    let existingFhirPatientId: number | null = null;
    if (input.patientId) {
      try {
        const existing = await prismaTelemedicine.patient.findUnique({
          where: { id: input.patientId },
          select: { fhirPatientId: true },
        });
        existingFhirPatientId = existing?.fhirPatientId ?? null;
      } catch (err) {
        console.error("[FHIR] Failed to fetch existing fhirPatientId:", err);
      }
    }

    // Push demographics to FHIR first
    let fhirPatientId: number | undefined;
    try {
      const { given_name, family_name } = parseName(input.name);
      const fhirPayload = {
        given_name,
        family_name,
        gender: toFhirGender(input.gender),
        birth_date: toFhirDate(input.dateOfBirth),
        active: true,
      };

      const fhirResponse = existingFhirPatientId
        ? await updateFhirPatient(String(existingFhirPatientId), fhirPayload)
        : await createFhirPatient(fhirPayload);

      fhirPatientId = Number(fhirResponse.id);
    } catch (err) {
      console.error(
        "[FHIR] createorUpdatePatientPersonalDetails sync failed:",
        err,
      );
    }

    return await withMonitoring<TCreateOrUpdatePatientPersonalDetailsOutput>(
      "createorUpdatePatientPersonal",
      () =>
        createorUpdatePatientPersonalDetailsController(input, fhirPatientId),
      {
        url: "/bezs/telemedicine/patient/profile",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${isUpdate ? "update" : "create"} personal profile.`,
      },
    );
  });
