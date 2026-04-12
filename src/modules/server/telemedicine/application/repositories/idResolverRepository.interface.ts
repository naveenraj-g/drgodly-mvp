export interface IIdResolverRepository {
  resolveDoctorIdByUserIdAndOrgId(
    userId: string,
    orgId: string
  ): Promise<string | null>;
  resolvePatientIdByUserIdAndOrgId(
    userId: string,
    orgId: string
  ): Promise<string | null>;
}
