const { z } = require('zod');

const recipeSchema = z.object({
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

module.exports = { recipeSchema };
