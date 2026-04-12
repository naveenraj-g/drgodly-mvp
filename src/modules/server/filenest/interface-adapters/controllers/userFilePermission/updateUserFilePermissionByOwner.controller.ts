import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { updateUserFilePermissionByOwnerUseCase } from "../../../application/useCases/userFilePermission/updateUserFilePermissionByOwner.useCase";
import { UpdateUserFilePermissionValidationSchema } from "../../../../../shared/schemas/filenest/userFilePermission/userFilePermissionValidationSchemas";
import { TUserFilePermissionSchema } from "../../../../../shared/entities/models/filenest/userFilePermission";

function presenter(data: TUserFilePermissionSchema) {
  return data;
}

export type TUpdateUserFilePermissionByOwnerController = ReturnType<
  typeof presenter
>;

export async function updateUserFilePermissionByOwnerController(
  input: any
): Promise<TUpdateUserFilePermissionByOwnerController> {
  const { data, error } =
    await UpdateUserFilePermissionValidationSchema.safeParseAsync(input);

  if (error) {
    throw new InputParseError(error.name, { cause: error });
  }

  const updatedPermission = await updateUserFilePermissionByOwnerUseCase(data);
  return presenter(updatedPermission);
}
