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
    isABDMDoctorProfile: boolean
  ): Promise<TDoctorInitialProfile>;
  deleteDoctorProfile(id: string): Promise<TDoctorInitialProfile>;
  getDoctorDataById(id: string): Promise<TDoctor | null>;
  getDoctorDataByUserId(userId: string, orgId: string): Promise<TDoctor | null>;
  getDoctorInitialProfileByUniqueFields(
    orgId: string,
    userId: string
  ): Promise<TDoctorInitialProfile | null>;
  createDoctorPersonalDetails(
    createData: TCreateOrUpdateDoctorProfileDetail
  ): Promise<TDoctorPersonalDetails>;
  updateDoctorPersonalDetails(
    updateData: TCreateOrUpdateDoctorProfileDetail
  ): Promise<TDoctorPersonalDetails>;

  createDoctorQualificationDetails(
    createData: TCreateOrUpdateDoctorQualificationDetail
  ): Promise<TDoctorQualifications>;
  updateDoctorQualificationDetails(
    updateData: TCreateOrUpdateDoctorQualificationDetail
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

  submitDoctorFullProfile(data: TSubmitFullDoctorProfile): Promise<TDoctor>;
}
