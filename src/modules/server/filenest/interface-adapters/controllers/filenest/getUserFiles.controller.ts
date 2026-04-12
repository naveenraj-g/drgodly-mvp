import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { GetUserFilePayloadSchema } from "../../../../../shared/schemas/filenest/filenestSchema";
import { getUserFilesUseCase } from "../../../application/useCases/filenest/getUserFiles.useCase";
import { TUserFiles } from "../../../../../shared/entities/models/filenest/filenest";

function presenter(data: TUserFiles) {
  return data;
}
export type TGetUserFilesControllerOutput = ReturnType<typeof presenter>;

export async function getUserFilesController(
  input: any
): Promise<TGetUserFilesControllerOutput> {
  const { data, error: inputParseError } =
    await GetUserFilePayloadSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const filesData = await getUserFilesUseCase(data);
  return presenter(filesData);
}
