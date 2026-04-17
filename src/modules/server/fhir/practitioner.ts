import { fhirRequest } from "./client";
import type {
  FhirPractitionerCreatePayload,
  FhirPractitionerPatchPayload,
  FhirPractitionerResponse,
} from "./types";

/**
 * Creates a new Practitioner resource on the FHIR server.
 * Returns the response including the public FHIR practitioner id (e.g. "30001").
 * Store this id to reference the practitioner in future Encounter/Appointment calls.
 */
export async function createFhirPractitioner(
  payload: FhirPractitionerCreatePayload,
): Promise<FhirPractitionerResponse> {
  return fhirRequest<FhirPractitionerResponse>(
    "POST",
    "/api/fhir/v1/practitioners/",
    payload,
  );
}

/**
 * Partially updates an existing Practitioner resource.
 * @param fhirPractitionerId - the public FHIR practitioner id returned from createFhirPractitioner
 */
export async function updateFhirPractitioner(
  fhirPractitionerId: string,
  payload: FhirPractitionerPatchPayload,
): Promise<FhirPractitionerResponse> {
  return fhirRequest<FhirPractitionerResponse>(
    "PATCH",
    `/api/fhir/v1/practitioners/${fhirPractitionerId}`,
    payload,
  );
}

/**
 * Deletes a Practitioner resource from the FHIR server.
 * @param fhirPractitionerId - the public FHIR practitioner id
 */
export async function deleteFhirPractitioner(
  fhirPractitionerId: string,
): Promise<void> {
  return fhirRequest<void>(
    "DELETE",
    `/api/fhir/v1/practitioners/${fhirPractitionerId}`,
  );
}
