import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { orgIdSchema } from "../../../../../shared/entities/models/shared/shared";
import { getAppsByOrgIdUseCase } from "../../application/useCases/getAppsByOrgId.useCase";
import { TApps } from "../../entities/models/app";

function presenter(apps: TApps) {
  return apps;
}

export type TGetAppsByOrgIdControllerOutput = ReturnType<typeof presenter>;

export async function getAppsByOrgIdController(
  input: any
): Promise<TGetAppsByOrgIdControllerOutput> {
  const { data, error: inputParseError } = await orgIdSchema.safeParseAsync(
    input
  );

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const apps = await getAppsByOrgIdUseCase(data.orgId);

  return presenter(apps);
}
