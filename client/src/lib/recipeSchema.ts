import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  baseServings: z.number(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.string(),
      swapSuggestion: z.string().optional().nullable()
    })
  ),
  steps: z.array(z.string())
});

export type Recipe = z.infer<typeof recipeSchema>;
