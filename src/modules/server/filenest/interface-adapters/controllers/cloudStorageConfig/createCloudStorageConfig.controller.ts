import { TCloudStorageConfigSchema } from "../../../../../shared/entities/models/filenest/cloudStorage";
import { InputParseError } from "../../../../../../modules/shared/entities/errors/commonError";
import { CreateCloudStorageValidationSchema } from "../../../../../shared/schemas/filenest/filenestValidationSchemas";
import { createCloudStorageConfigUseCase } from "../../../application/useCases/cloudStorageConfig/createCloudStorageConfig.useCase";

function presenter(data: TCloudStorageConfigSchema) {
  return data;
}

export type TCreateCloudStorageConfigControllerOutput = ReturnType<
  typeof presenter
>;

export async function createCloudStorageConfigController(
  input: any
): Promise<TCreateCloudStorageConfigControllerOutput> {
  const { data, error: inputParseError } =
    await CreateCloudStorageValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const cloudStorageConfig = await createCloudStorageConfigUseCase(data);

  return presenter(cloudStorageConfig);
}
