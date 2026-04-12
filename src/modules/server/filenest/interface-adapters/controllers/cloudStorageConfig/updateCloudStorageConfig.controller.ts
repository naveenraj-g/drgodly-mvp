import { TCloudStorageConfigSchema } from "../../../../../shared/entities/models/filenest/cloudStorage";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { UpdateCloudStorageValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { updateCloudStorageConfigUseCase } from "../../../application/useCases/cloudStorageConfig/updateCloudStorageConfig.useCase";

function presenter(data: TCloudStorageConfigSchema) {
  return data;
}

export type TUpdateCloudStorageConfigControllerOutput = ReturnType<
  typeof presenter
>;

export async function updateCloudStorageConfigController(
  input: any
): Promise<TUpdateCloudStorageConfigControllerOutput> {
  const { data, error: inputParseError } =
    await UpdateCloudStorageValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const cloudStorageConfig = await updateCloudStorageConfigUseCase(data);

  return presenter(cloudStorageConfig);
}
