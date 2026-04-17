import { fhirRequest } from "./client";
import type {
  FhirEncounterCreatePayload,
  FhirEncounterPatchPayload,
  FhirEncounterResponse,
} from "./types";

/**
 * Creates a new Encounter resource on the FHIR server.
 * Returns the response including the public FHIR encounter id (e.g. "20001").
 *
 * NOTE: Appointments reference this via the integer form of the id
 * (encounter_id: 20001), so parse the returned id as a number when needed.
 */
export async function createFhirEncounter(
  payload: FhirEncounterCreatePayload,
): Promise<FhirEncounterResponse> {
  return fhirRequest<FhirEncounterResponse>(
    "POST",
    "/api/fhir/v1/encounters/",
    payload,
  );
}

/**
 * Partially updates an Encounter.
 * Only lifecycle fields are patchable: status, period_end, priority.
 * @param fhirEncounterId - the public FHIR encounter id (string, e.g. "20001")
 */
export async function updateFhirEncounter(
  fhirEncounterId: string,
  payload: FhirEncounterPatchPayload,
): Promise<FhirEncounterResponse> {
  return fhirRequest<FhirEncounterResponse>(
    "PATCH",
    `/api/fhir/v1/encounters/${fhirEncounterId}`,
    payload,
  );
}

/**
 * Deletes an Encounter resource from the FHIR server.
 * @param fhirEncounterId - the public FHIR encounter id
 */
export async function deleteFhirEncounter(
  fhirEncounterId: string,
): Promise<void> {
  return fhirRequest<void>(
    "DELETE",
    `/api/fhir/v1/encounters/${fhirEncounterId}`,
  );
}
