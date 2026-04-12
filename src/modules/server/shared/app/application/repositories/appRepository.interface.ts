import { TApp, TApps } from "../../entities/models/app";

export interface IAppRepository {
  getAppsByOrgId(orgId: string): Promise<TApps>;
  getAppsByOrgIdAndSlug(orgId: string, slug: string): Promise<TApp | null>;
}
