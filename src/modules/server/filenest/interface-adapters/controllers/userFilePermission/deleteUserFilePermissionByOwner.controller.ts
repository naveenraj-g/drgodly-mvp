import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { deleteUserFilePermissionByOwnerUseCase } from "../../../application/useCases/userFilePermission/deleteUserFilePermissionByOwner.useCase";
import { DeleteUserFilePermissionValidationSchema } from "../../../../../shared/schemas/filenest/userFilePermission/userFilePermissionValidationSchemas";
import { TUserFilePermissionSchema } from "../../../../../shared/entities/models/filenest/userFilePermission";

function presenter(data: TUserFilePermissionSchema) {
  return data;
}

export type TDeleteUserFilePermissionByOwnerController = ReturnType<
  typeof presenter
>;

export async function deleteUserFilePermissionByOwnerController(
  input: any
): Promise<TDeleteUserFilePermissionByOwnerController> {
  const { data, error } =
    await DeleteUserFilePermissionValidationSchema.safeParseAsync(input);

  if (error) {
    throw new InputParseError(error.name, { cause: error });
  }

  const result = await deleteUserFilePermissionByOwnerUseCase(data);
  return presenter(result);
}
