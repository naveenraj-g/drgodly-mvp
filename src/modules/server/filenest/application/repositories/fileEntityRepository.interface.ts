import {
  TFileEntitiesSchema,
  TFileEntitySchema,
  TGetFileEntities,
  TCreateFileEntity,
  TUpdateFileEntity,
  TDeleteFileEntity,
  TGetFileEntitiesByAppId,
} from "../../../../shared/entities/models/filenest/fileEntity";

export interface IFileEntityRepository {
  getFileEntities(getData: TGetFileEntities): Promise<TFileEntitiesSchema>;
  createFileEntity(createData: TCreateFileEntity): Promise<TFileEntitySchema>;
  updateFileEntity(updateData: TUpdateFileEntity): Promise<TFileEntitySchema>;
  deleteFileEntity(deleteData: TDeleteFileEntity): Promise<TFileEntitySchema>;

  getFileEntitiesByAppId(
    getData: TGetFileEntitiesByAppId
  ): Promise<TFileEntitiesSchema>;

  getFileEntityById(
    getData: TGetFileEntitiesByAppId & { id: bigint }
  ): Promise<TFileEntitySchema | null>;
}
