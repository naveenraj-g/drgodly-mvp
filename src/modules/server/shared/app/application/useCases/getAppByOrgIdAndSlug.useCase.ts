import { getSharedInjection } from "../../../di/container";
import { TApp } from "../../entities/models/app";

export async function getAppByOrgIdAndSlugUseCase(
  orgId: string,
  slug: string
): Promise<TApp | null> {
  const appRepository = getSharedInjection("IAppRepository");
  const app = await appRepository.getAppsByOrgIdAndSlug(orgId, slug);
  return app;
}
