export interface IABDMService {
  getDoctorProfileByHPRId(hprId: string): Promise<any>;
}
