import { TGetFileUploadRequiredDataControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/localFileOperation";
import { TSharedUser } from "@/modules/shared/types";
import { ZSAError } from "zsa";

export interface IFileUploadProps {
  fileUploadData?: TGetFileUploadRequiredDataControllerOutput | null;
  user: TSharedUser;
  modalError?: ZSAError | null;
  url?: string | null;
  queryKey?: (string | number | null | undefined)[] | null;
}
