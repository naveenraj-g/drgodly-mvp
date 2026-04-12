import z from "zod";

export const App = z.object({
  name: z.string(),
  id: z.string(),
  slug: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
});
export type TApp = z.infer<typeof App>;

export const Apps = z.array(App);
export type TApps = z.infer<typeof Apps>;
