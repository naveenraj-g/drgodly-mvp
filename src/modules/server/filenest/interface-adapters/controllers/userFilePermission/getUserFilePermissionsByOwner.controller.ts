import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { getUserFilePermissionsByOwnerUseCase } from "../../../application/useCases/userFilePermission/getUserFilePermissionsByOwner.useCase";
import { GetUserFilePermissionsByOwnerValidationSchema } from "../../../../../shared/schemas/filenest/userFilePermission/userFilePermissionValidationSchemas";
import { TUserFilePermissionsSchema } from "../../../../../shared/entities/models/filenest/userFilePermission";

function presenter(data: TUserFilePermissionsSchema) {
  return data;
}

export type TGetUserFilePermissionsByOwnerController = ReturnType<
  typeof presenter
>;

export async function getUserFilePermissionsByOwnerController(
  input: any
): Promise<TGetUserFilePermissionsByOwnerController> {
  const { data, error } =
    await GetUserFilePermissionsByOwnerValidationSchema.safeParseAsync(input);

  if (error) {
    throw new InputParseError(error.name, { cause: error });
  }

  return presenter(await getUserFilePermissionsByOwnerUseCase(data));
}
