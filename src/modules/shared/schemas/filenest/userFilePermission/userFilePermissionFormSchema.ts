import z from "zod";

// Form schema for sharing a file
export const ShareUserFileFormSchema = z
  .object({
    canView: z.boolean(),
    canDownload: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.canView && !data.canDownload) {
      ctx.addIssue({
        path: ["canView"],
        code: z.ZodIssueCode.custom,
        message: "At least one permission must be enabled",
      });
    }
  });
export type TShareUserFileFormSchema = z.infer<typeof ShareUserFileFormSchema>;
