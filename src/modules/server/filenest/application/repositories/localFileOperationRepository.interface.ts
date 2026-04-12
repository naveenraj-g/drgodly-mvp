import {
  TFileDatasSchema,
  TFileUploadRequiredDataSchema,
  TGetFileUploadRequiredData,
} from "../../../../shared/entities/models/filenest/fileUpload";

export interface ILocalFileOperationRepository {
  getFileUploadRequiredData(
    getData: TGetFileUploadRequiredData
  ): Promise<TFileUploadRequiredDataSchema>;

  uploadLocalUserFile(payload: TFileDatasSchema): Promise<{ success: boolean }>;
  deleteLocalUserFile(payload: {
    id: bigint;
    fileName: string;
  }): Promise<{ success: boolean }>;
}
