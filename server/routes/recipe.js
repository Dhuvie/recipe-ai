const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { recipeSchema } = require('../schema');

const router = express.Router();

router.post('/', async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || typeof ingredients !== 'string' || ingredients.trim().length === 0) {
    return res.status(400).json({ code: 'VALIDATION_ERROR' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ code: 'PROVIDER_ERROR' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    const prompt = `Create a recipe using the following ingredients: ${ingredients}.
Return the result exactly as a JSON object matching this schema:
{
  "title": "string",
  "description": "string",
  "prepTime": "string",
  "cookTime": "string",
  "baseServings": number,
  "ingredients": [
    {
      "name": "string",
      "amount": number,
      "unit": "string",
      "swapSuggestion": "string or null"
    }
  ],
  "steps": ["string"]
}
Do not include any other text, markdown formatting, or explanations. Just the JSON object.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    let result;
    try {
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });
      clearTimeout(timeoutId);
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        return res.status(504).json({ code: 'TIMEOUT_ERROR' });
      }
      return res.status(500).json({ code: 'PROVIDER_ERROR' });
    }

    const responseText = result.response.text();
    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (e) {
      return res.status(502).json({ code: 'PARSE_ERROR' });
    }

    const validationResult = recipeSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      return res.status(502).json({ code: 'SCHEMA_ERROR' });
    }

    return res.json(validationResult.data);
  } catch (error) {
    return res.status(500).json({ code: 'PROVIDER_ERROR' });
  }
});

module.exports = router;
