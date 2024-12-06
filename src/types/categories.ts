import { z } from "zod";

export const CategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const CategoriesSchema = z.object({
  categories: z.array(CategorySchema),
});
export type Categories = z.infer<typeof CategoriesSchema>;
