import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { GetAppByOrgIdAndSlug } from "../../../../../shared/entities/models/shared/shared";
import { getAppByOrgIdAndSlugUseCase } from "../../application/useCases/getAppByOrgIdAndSlug.useCase";
import { TApp } from "../../entities/models/app";

function presenter(apps: TApp | null) {
  return apps;
}

export type TGetAppsByOrgIdAndSlugControllerOutput = ReturnType<
  typeof presenter
>;

export async function getAppsByOrgIdAndSlugController(
  input: any
): Promise<TGetAppsByOrgIdAndSlugControllerOutput> {
  const { data, error: inputParseError } =
    await GetAppByOrgIdAndSlug.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const app = await getAppByOrgIdAndSlugUseCase(data.orgId, data.slug);

  return presenter(app);
}
