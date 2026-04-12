import { useFileUploadCore } from "../../shared/hooks/useFileUploadCore";

export function useTelemedicineFaceVerificationUploads() {
  return {
    front: useFileUploadCore({
      maxFiles: 1,
      accept: { "image/*": [] },
      disableExceedLimit: true,
      skipSimulate: true,
      maxSizeMb: 10,
      noClick: true,
    }),
    left: useFileUploadCore({
      maxFiles: 1,
      accept: { "image/*": [] },
      disableExceedLimit: true,
      skipSimulate: true,
      maxSizeMb: 10,
      noClick: true,
    }),
    right: useFileUploadCore({
      maxFiles: 1,
      accept: { "image/*": [] },
      disableExceedLimit: true,
      skipSimulate: true,
      maxSizeMb: 10,
      noClick: true,
    }),
    up: useFileUploadCore({
      maxFiles: 1,
      accept: { "image/*": [] },
      disableExceedLimit: true,
      skipSimulate: true,
      maxSizeMb: 10,
      noClick: true,
    }),
    down: useFileUploadCore({
      maxFiles: 1,
      accept: { "image/*": [] },
      disableExceedLimit: true,
      skipSimulate: true,
      maxSizeMb: 10,
      noClick: true,
    }),
  };
}
