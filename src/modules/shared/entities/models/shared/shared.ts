import z from "zod";

export const orgIdSchema = z.object({
  orgId: z.string(),
});

export const GetAppByOrgIdAndSlug = z.object({
  orgId: z.string().min(1, "Org ID is required"),
  slug: z.string().min(1, "Slug is required"),
});
