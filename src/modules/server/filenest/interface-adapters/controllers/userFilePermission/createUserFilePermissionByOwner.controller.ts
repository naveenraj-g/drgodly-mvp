import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { createUserFilePermissionByOwnerUseCase } from "../../../application/useCases/userFilePermission/createUserFilePermissionByOwner.useCase";
import { CreateUserFilePermissionValidationSchema } from "../../../../../shared/schemas/filenest/userFilePermission/userFilePermissionValidationSchemas";
import { TUserFilePermissionSchema } from "../../../../../shared/entities/models/filenest/userFilePermission";

function presenter(data: TUserFilePermissionSchema) {
  return data;
}

export type TCreateUserFilePermissionByOwnerControllerOutput = ReturnType<
  typeof presenter
>;

export async function createUserFilePermissionByOwnerController(
  input: any
): Promise<TCreateUserFilePermissionByOwnerControllerOutput> {
  const { data, error } =
    await CreateUserFilePermissionValidationSchema.safeParseAsync(input);

  if (error) {
    throw new InputParseError(error.name, { cause: error });
  }

  const result = await createUserFilePermissionByOwnerUseCase(data);
  return presenter(result);
}
