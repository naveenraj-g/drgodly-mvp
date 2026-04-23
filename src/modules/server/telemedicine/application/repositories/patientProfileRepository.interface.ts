import {
  TPatientCreateOrUpdatePatientProfile,
  TPatientInitialProfile,
  TPatientPersonalDetails,
  TPatientWithPersonalProfile,
} from "../../../../shared/entities/models/telemedicine/patientProfile";

export interface IPatientProfileRepository {
  createPatientInitialProfile(
    orgId: string,
    userId: string,
    createdBy: string,
    isABHAPatientProfile: boolean,
    fhirPatientId?: number
  ): Promise<TPatientInitialProfile>;
  getPatientWithPersonalProfile(
    orgId: string,
    userId: string
  ): Promise<TPatientWithPersonalProfile | null>;
  createPatientPersonalDetails(
    createData: TPatientCreateOrUpdatePatientProfile,
    fhirPatientId?: number
  ): Promise<TPatientPersonalDetails>;
  updatePatientPersonalDetails(
    updateData: TPatientCreateOrUpdatePatientProfile,
    fhirPatientId?: number
  ): Promise<TPatientPersonalDetails>;
}
