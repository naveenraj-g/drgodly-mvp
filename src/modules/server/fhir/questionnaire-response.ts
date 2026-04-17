import { fhirRequest } from "./client";
import type {
  FhirQuestionnaireResponseCreatePayload,
  FhirQuestionnaireResponsePatchPayload,
  FhirQuestionnaireResponseResponse,
} from "./types";

/**
 * Creates a new QuestionnaireResponse resource on the FHIR server.
 *
 * References use the string format "Resource/public_id", e.g.:
 *   subject:   "Patient/10001"
 *   encounter: "Encounter/20001"   ← string reference, NOT an integer encounter_id
 *   author:    "Practitioner/30001"
 *
 * @returns the created resource including its public FHIR id (e.g. "60001")
 */
export async function createFhirQuestionnaireResponse(
  payload: FhirQuestionnaireResponseCreatePayload,
): Promise<FhirQuestionnaireResponseResponse> {
  return fhirRequest<FhirQuestionnaireResponseResponse>(
    "POST",
    "/api/fhir/v1/questionnaire-responses/",
    payload,
  );
}

/**
 * Partially updates a QuestionnaireResponse.
 * Only lifecycle fields are patchable: status, authored.
 * To replace items/answers, delete and re-create the resource.
 *
 * @param fhirQrId - the public FHIR questionnaire response id
 */
export async function updateFhirQuestionnaireResponse(
  fhirQrId: string,
  payload: FhirQuestionnaireResponsePatchPayload,
): Promise<FhirQuestionnaireResponseResponse> {
  return fhirRequest<FhirQuestionnaireResponseResponse>(
    "PATCH",
    `/api/fhir/v1/questionnaire-responses/${fhirQrId}`,
    payload,
  );
}

/**
 * Deletes a QuestionnaireResponse resource.
 * @param fhirQrId - the public FHIR questionnaire response id
 */
export async function deleteFhirQuestionnaireResponse(
  fhirQrId: string,
): Promise<void> {
  return fhirRequest<void>(
    "DELETE",
    `/api/fhir/v1/questionnaire-responses/${fhirQrId}`,
  );
}
