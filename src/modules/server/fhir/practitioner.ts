import { fhirRequest } from "./client";
import type {
  FhirPractitionerCreatePayload,
  FhirPractitionerPatchPayload,
  FhirPractitionerResponse,
  FhirPractitionerTelecomPayload,
  FhirPractitionerAddressPayload,
  FhirPractitionerIdentifierPayload,
  FhirPractitionerQualificationPayload,
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

// ─────────────────────────────────────────────────────────────────────────────
// Sub-resource endpoints (require an existing FHIR practitioner id)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adds a contact point (phone / email / etc.) to a Practitioner.
 */
export async function addFhirPractitionerTelecom(
  fhirPractitionerId: string,
  payload: FhirPractitionerTelecomPayload,
): Promise<FhirPractitionerResponse> {
  return fhirRequest<FhirPractitionerResponse>(
    "POST",
    `/api/fhir/v1/practitioners/${fhirPractitionerId}/telecom`,
    payload,
  );
}

/**
 * Adds an address to a Practitioner.
 */
export async function addFhirPractitionerAddress(
  fhirPractitionerId: string,
  payload: FhirPractitionerAddressPayload,
): Promise<FhirPractitionerResponse> {
  return fhirRequest<FhirPractitionerResponse>(
    "POST",
    `/api/fhir/v1/practitioners/${fhirPractitionerId}/addresses`,
    payload,
  );
}

/**
 * Adds a business identifier (e.g. NPI, council registration number) to a Practitioner.
 */
export async function addFhirPractitionerIdentifier(
  fhirPractitionerId: string,
  payload: FhirPractitionerIdentifierPayload,
): Promise<FhirPractitionerResponse> {
  return fhirRequest<FhirPractitionerResponse>(
    "POST",
    `/api/fhir/v1/practitioners/${fhirPractitionerId}/identifiers`,
    payload,
  );
}

/**
 * Adds a professional qualification (degree, certification, licence) to a Practitioner.
 */
export async function addFhirPractitionerQualification(
  fhirPractitionerId: string,
  payload: FhirPractitionerQualificationPayload,
): Promise<FhirPractitionerResponse> {
  return fhirRequest<FhirPractitionerResponse>(
    "POST",
    `/api/fhir/v1/practitioners/${fhirPractitionerId}/qualifications`,
    payload,
  );
}
