import z from "zod";

export const AppMenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  appId: z.string(),
  updatedAt: z.date(),
  icon: z.string().nullable(),
});
export type TAppMenuItem = z.infer<typeof AppMenuItemSchema>;

export const AppMenuItemsDataSchema = z.object({
  appMenuItemsData: z.array(AppMenuItemSchema),
  total: z.number(),
});
export type TAppMenuItemsData = z.infer<typeof AppMenuItemsDataSchema>;

export const AppIdSchema = z.object({
  appId: z.string(),
});

export const CreateAppMenuItemSchema = AppMenuItemSchema.pick({
  appId: true,
  name: true,
  slug: true,
  icon: true,
  description: true,
});
export type TCreateAppMenuItem = z.infer<typeof CreateAppMenuItemSchema>;

export const UpdateAppMenuItemSchema = CreateAppMenuItemSchema.merge(
  AppMenuItemSchema.pick({ id: true })
);
export type TUpdateAppMenuItem = z.infer<typeof UpdateAppMenuItemSchema>;

export const DeleteAppMenuItemSchema = AppMenuItemSchema.pick({
  appId: true,
  id: true,
});
export type TDeleteAppMenuItem = z.infer<typeof DeleteAppMenuItemSchema>;
