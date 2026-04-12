import { FileUploadValidationSchema } from "../../../../../shared/schemas/filenest/fileUploadValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { uploadLocalUserFileUseCase } from "../../../application/useCases/localFileOperation/uploadLocalUserFile.useCase";

function presenter(data: { success: boolean }) {
  return data;
}

export type TUploadLocalUserFileControllerOutput = ReturnType<typeof presenter>;

export async function uploadLocalUserFileController(
  input: any
): Promise<TUploadLocalUserFileControllerOutput> {
  const { data, error: inputParseError } =
    await FileUploadValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const uploaded = await uploadLocalUserFileUseCase(data);
  return presenter(uploaded);
}
