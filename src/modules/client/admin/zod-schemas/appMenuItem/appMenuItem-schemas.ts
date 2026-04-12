import z from "zod";

export const getAppMenuItemsSchema = z.object({
  appId: z.string(),
});
