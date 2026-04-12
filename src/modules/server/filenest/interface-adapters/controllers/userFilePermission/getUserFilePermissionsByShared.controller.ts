import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { getUserFilePermissionsBySharedUseCase } from "../../../application/useCases/userFilePermission/getUserFilePermissionsByShared.useCase.";
import { GetUserFilePermissionsBySharedValidationSchema } from "../../../../../shared/schemas/filenest/userFilePermission/userFilePermissionValidationSchemas";
import { TUserFilePermissionsSchema } from "../../../../../shared/entities/models/filenest/userFilePermission";

function presenter(data: TUserFilePermissionsSchema) {
  return data;
}

export type TGetUserFilePermissionsBySharedController = ReturnType<
  typeof presenter
>;

export async function getUserFilePermissionsBySharedController(
  input: any
): Promise<TGetUserFilePermissionsBySharedController> {
  const { data, error } =
    await GetUserFilePermissionsBySharedValidationSchema.safeParseAsync(input);

  if (error) {
    throw new InputParseError(error.name, { cause: error });
  }

  return presenter(await getUserFilePermissionsBySharedUseCase(data));
}
