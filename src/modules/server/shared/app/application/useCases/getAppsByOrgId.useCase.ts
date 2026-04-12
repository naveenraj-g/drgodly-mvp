import { getSharedInjection } from "../../../di/container";
import { TApps } from "../../entities/models/app";

export async function getAppsByOrgIdUseCase(orgId: string): Promise<TApps> {
  const appRepository = getSharedInjection("IAppRepository");
  const apps = await appRepository.getAppsByOrgId(orgId);
  return apps;
}
