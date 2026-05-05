import { InputParseError } from "@/modules/shared/entities/errors/commonError";
import { GetUsersByIdAndOrgIdValidationSchema } from "@/modules/shared/schemas/shared/user";
import { getUsersByIdAndOrgIdUseCase } from "../../../application/useCases/getUsersByIdAndOrgId.useCase";
import { TUser } from "../../../entities/models/user";

function presenter(data: TUser) {
  return data;
}
export type TGetUsersByIdAndOrgIdControllerOutput = ReturnType<
  typeof presenter
>;

export async function getUsersByIdAndOrgIdController(
  input: any
): Promise<TGetUsersByIdAndOrgIdControllerOutput> {
  const { data, error: inputParseError } =
    await GetUsersByIdAndOrgIdValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const user = await getUsersByIdAndOrgIdUseCase(data.userId, data.orgId);
  return presenter(user);
}
