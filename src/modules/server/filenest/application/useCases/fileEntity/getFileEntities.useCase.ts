import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TFileEntitiesSchema,
  TGetFileEntities,
} from "../../../../../shared/entities/models/filenest/fileEntity";

export async function getFileEntitiesUseCase(
  input: TGetFileEntities & { userId: string }
): Promise<TFileEntitiesSchema> {
  const userService = getSharedInjection("IUserService");
  const repo = getFilenestInjection("IFileEntityRepository");

  const ok = await userService.isUserInOrg(input.userId, input.orgId);
  if (!ok)
    throw new Error("Access denied: the user must be part of the organization");

  return repo.getFileEntities({
    orgId: input.orgId,
  });
}
