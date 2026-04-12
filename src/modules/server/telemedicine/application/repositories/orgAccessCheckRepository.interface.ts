export interface IOrgAccessCheckRepository {
  isDoctorInOrg(doctorId: string, orgId: string): Promise<boolean>;
}
