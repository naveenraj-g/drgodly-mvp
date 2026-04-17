import { fhirRequest } from "./client";
import type {
  FhirPatientCreatePayload,
  FhirPatientPatchPayload,
  FhirPatientResponse,
} from "./types";

/**
 * Creates a new Patient resource on the FHIR server.
 * Returns the response including the public FHIR patient id (e.g. "10001").
 * Store this id to reference the patient in future Encounter/Appointment calls.
 */
export async function createFhirPatient(
  payload: FhirPatientCreatePayload,
): Promise<FhirPatientResponse> {
  return fhirRequest<FhirPatientResponse>("POST", "/api/fhir/v1/patients/", payload);
}

/**
 * Partially updates an existing Patient resource.
 * @param fhirPatientId - the public FHIR patient id returned from createFhirPatient
 */
export async function updateFhirPatient(
  fhirPatientId: string,
  payload: FhirPatientPatchPayload,
): Promise<FhirPatientResponse> {
  return fhirRequest<FhirPatientResponse>(
    "PATCH",
    `/api/fhir/v1/patients/${fhirPatientId}`,
    payload,
  );
}

/**
 * Deletes a Patient resource from the FHIR server.
 * @param fhirPatientId - the public FHIR patient id
 */
export async function deleteFhirPatient(fhirPatientId: string): Promise<void> {
  return fhirRequest<void>("DELETE", `/api/fhir/v1/patients/${fhirPatientId}`);
}
