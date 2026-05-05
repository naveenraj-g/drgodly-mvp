import { InputParseError } from "../../../../../../shared/entities/errors/commonError";
import { GetUserByUserNameOrEmailAndOrgIdValidationSchema } from "../../../../../../shared/schemas/filenest/filenestSchema";
import { getUserByUserNameOrEmailAndOrgIdUseCase } from "../../../application/useCases/getUserByUserNameOrEmailAndOrgId.useCase";
import { TUser } from "../../../entities/models/user";

function presenter(data: TUser) {
  return data;
}

export type TGetUserByUserNameOrEmailAndOrgIdControllerOutput = ReturnType<
  typeof presenter
>;

export async function getUserByUserNameOrEmailAndOrgIdController(
  input: any
): Promise<TGetUserByUserNameOrEmailAndOrgIdControllerOutput> {
  const { data, error: inputParseError } =
    await GetUserByUserNameOrEmailAndOrgIdValidationSchema.safeParseAsync(
      input
    );

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const user = await getUserByUserNameOrEmailAndOrgIdUseCase({
    emailOrUsername: data.shareWith,
    orgId: data.orgId,
  });

  return presenter(user);
}
