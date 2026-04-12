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
    isABHAPatientProfile: boolean
  ): Promise<TPatientInitialProfile>;
  getPatientWithPersonalProfile(
    orgId: string,
    userId: string
  ): Promise<TPatientWithPersonalProfile | null>;
  createPatientPersonalDetails(
    createData: TPatientCreateOrUpdatePatientProfile
  ): Promise<TPatientPersonalDetails>;
  updatePatientPersonalDetails(
    updateData: TPatientCreateOrUpdatePatientProfile
  ): Promise<TPatientPersonalDetails>;
}
