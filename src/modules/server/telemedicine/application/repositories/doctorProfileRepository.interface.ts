import {
  TCreateOrUpdateDoctorConcent,
  TCreateOrUpdateDoctorProfileDetail,
  TCreateOrUpdateDoctorQualificationDetail,
  TCreateOrUpdateDoctorWorkDetail,
  TDoctor,
  TDoctorConcent,
  TDoctorDatas,
  TDoctorInitialProfile,
  TDoctorPersonalDetails,
  TDoctorQualifications,
  TDoctorWorkDetails,
  TSubmitFullDoctorProfile,
} from "../../../../shared/entities/models/telemedicine/doctorProfile";

export interface IDoctorProfileRepository {
  getAllDoctorsData(orgId: string): Promise<TDoctorDatas>;
  createDoctorInitialProfile(
    orgId: string,
    createdBy: string,
    isABDMDoctorProfile: boolean,
    fhirPractitionerId?: number
  ): Promise<TDoctorInitialProfile>;
  deleteDoctorProfile(id: string): Promise<TDoctorInitialProfile>;
  getDoctorDataById(id: string): Promise<TDoctor | null>;
  getDoctorDataByUserId(userId: string, orgId: string): Promise<TDoctor | null>;
  getDoctorInitialProfileByUniqueFields(
    orgId: string,
    userId: string
  ): Promise<TDoctorInitialProfile | null>;
  createDoctorPersonalDetails(
    createData: TCreateOrUpdateDoctorProfileDetail,
    fhirPractitionerId?: number
  ): Promise<TDoctorPersonalDetails>;
  updateDoctorPersonalDetails(
    updateData: TCreateOrUpdateDoctorProfileDetail,
    fhirPractitionerId?: number
  ): Promise<TDoctorPersonalDetails>;

  createDoctorQualificationDetails(
    createData: TCreateOrUpdateDoctorQualificationDetail,
    fhirPractitionerId?: number
  ): Promise<TDoctorQualifications>;
  updateDoctorQualificationDetails(
    updateData: TCreateOrUpdateDoctorQualificationDetail,
    fhirPractitionerId?: number
  ): Promise<TDoctorQualifications>;

  createDoctorWorkDetails(
    createData: TCreateOrUpdateDoctorWorkDetail
  ): Promise<TDoctorWorkDetails>;
  updateDoctorWorkDetails(
    updateData: TCreateOrUpdateDoctorWorkDetail
  ): Promise<TDoctorWorkDetails>;

  createDoctorConcent(
    createData: TCreateOrUpdateDoctorConcent
  ): Promise<TDoctorConcent>;
  updateDoctorConcent(
    updateData: TCreateOrUpdateDoctorConcent
  ): Promise<TDoctorConcent>;

  submitDoctorFullProfile(
    data: TSubmitFullDoctorProfile,
    fhirPractitionerId?: number
  ): Promise<TDoctor>;
}
