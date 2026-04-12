import {
  TGetUserFilesByEntityIdPayload,
  TGetUserFilesByEntityPayload,
  TGetUserFilesPayload,
} from "../../../../shared/entities/models/filenest/filenest";
import { TUserFiles } from "../../../../shared/entities/models/filenest/filenest";

export interface IFilenestRepository {
  getUserFiles(payload: TGetUserFilesPayload): Promise<TUserFiles>;
  checkFileOwnerByUserIdAndOrgId(
    userId: string,
    orgId: string,
    userFileId: bigint
  ): Promise<boolean>;

  getUserFilesByEntity(
    payload: TGetUserFilesByEntityPayload
  ): Promise<TUserFiles>;

  getUserFilesByEntityId(
    payload: TGetUserFilesByEntityIdPayload
  ): Promise<TUserFiles>;
}
