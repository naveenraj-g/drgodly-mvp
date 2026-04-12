import z from "zod";

const FilesSchema = z.object({
  referenceId: z.string().nullish(),
  referenceType: z.string().nullish(),
  file: z.instanceof(File),
});

export const FileUploadValidationSchema = z.object({
  fileEntityId: z.bigint().positive(),
  files: z.array(FilesSchema),
  userId: z.string().min(1),
  orgId: z.string().min(1),
  appSlug: z.string().min(1),
});
export type TFileUploadValidationSchema = z.infer<
  typeof FileUploadValidationSchema
>;
