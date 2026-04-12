import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TFileEntitySchema,
  TUpdateFileEntity,
} from "../../../../../shared/entities/models/filenest/fileEntity";

export async function updateFileEntityUseCase(
  input: TUpdateFileEntity
): Promise<TFileEntitySchema> {
  const userService = getSharedInjection("IUserService");
  const repo = getFilenestInjection("IFileEntityRepository");

  const ok = await userService.isUserInOrg(input.userId, input.orgId);
  if (!ok)
    throw new Error("Access denied: the user must be part of the organization");

  return repo.updateFileEntity(input);
}
