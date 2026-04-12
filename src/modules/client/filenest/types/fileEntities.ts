import { TGetFileEntitiesControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/fileEntity";
import { TGetAppsByOrgIdControllerOutput } from "@/modules/server/shared/app/interface-adapters/controllers";
import { ZSAError } from "zsa";

export interface IFileEntitiesProps {
  fileEntities: TGetFileEntitiesControllerOutput | null;
  appDatas: TGetAppsByOrgIdControllerOutput | null;
  error: ZSAError | null;
}

export type TFileEntity = TGetFileEntitiesControllerOutput[number];
