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
import {
  createFhirPatient,
} from "@/modules/server/fhir";

// ── FHIR mapping helpers ──────────────────────────────────────────────────────

function parseName(fullName: string): { given_name: string; family_name?: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { given_name: parts[0] };
  return {
    given_name: parts.slice(0, -1).join(" "),
    family_name: parts[parts.length - 1],
  };
}

function toFhirDate(d: Date): string {
  return d.toISOString().split("T")[0];
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
      }
    );
  });

export const createPatientInitialProfile = createServerAction()
  .input(CreatePatientInitialProfileSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const result = await withMonitoring<TCreatePatientInitialProfileOutput>(
      "createPatientInitialProfile",
      () => createPatientInitialProfileController(input),
      {
        url: "/bezs/telemedicine/patient/profile",
        revalidatePath: true,
        operationErrorMessage: "Failed to create initial profile.",
      }
    );

    // Push a placeholder Patient to FHIR (demographics added in the next step).
    // Store the returned fhirPatient.id alongside the patient record to enable
    // future patch/delete operations on the FHIR server.
    try {
      await createFhirPatient({ active: true });
    } catch (err) {
      console.error("[FHIR] createPatientInitialProfile sync failed:", err);
    }

    return result;
  });

export const createorUpdatePatientPersonalDetails = createServerAction()
  .input(PatientProfileCreateOrUpdateValidationSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    const isUpdate = Boolean(input.id);

    const result = await withMonitoring<TCreateOrUpdatePatientPersonalDetailsOutput>(
      "createorUpdatePatientPersonal",
      () => createorUpdatePatientPersonalDetailsController(input),
      {
        url: "/bezs/telemedicine/patient/profile",
        revalidatePath: true,
        operationErrorMessage: `Failed to ${isUpdate ? "update" : "create"} personal profile.`,
      }
    );

    // Push full demographics to FHIR after every create/update.
    // TODO: once a fhirPatientId is stored in the Patient table, replace this
    // with updateFhirPatient(storedFhirId, payload) for the update case.
    try {
      const { given_name, family_name } = parseName(result.name);
      await createFhirPatient({
        given_name,
        family_name,
        gender: toFhirGender(result.gender),
        birth_date: toFhirDate(result.dateOfBirth),
        active: true,
      });
    } catch (err) {
      console.error("[FHIR] createorUpdatePatientPersonalDetails sync failed:", err);
    }

    return result;
  });
