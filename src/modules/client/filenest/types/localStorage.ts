import { TGetLocalStorageConfigsControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/localStorageConfig";
import { ZSAError } from "zsa";

export interface ILocalStorageProps {
  localStorageConfigs: TGetLocalStorageConfigsControllerOutput | null;
  error: ZSAError | null;
}

export type TLocalStorageConfig =
  TGetLocalStorageConfigsControllerOutput[number];
