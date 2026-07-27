const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

router.post('/stream', async (req, res) => {
  const { prompt, history = [] } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ code: 'VALIDATION_ERROR' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ code: 'PROVIDER_ERROR' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const systemInstruction = `You are a helpful culinary assistant.
You must return your response as a stream of blocks.
Output ONLY valid Newline-Delimited JSON (NDJSON). Each line must be a single, complete JSON object.
Do NOT output any markdown formatting, no backticks, no comments, no extra text. Just one JSON object per line.

Valid block types:
1. "card": { "type": "card", "content": { "title": "...", "description": "...", "prepTime": "...", "cookTime": "...", "servings": number } }
2. "checklist": { "type": "checklist", "title": "Ingredients or Steps", "items": ["item 1", "item 2"] }
3. "chart": { "type": "chart", "title": "Macros", "data": [{ "name": "Protein", "value": 30 }, { "name": "Carbs", "value": 50 }, { "name": "Fat", "value": 20 }] }

If the user is asking to refine an existing recipe, output the updated blocks.
Output exactly one "card" block first, then "checklist" blocks for ingredients and steps, and finally a "chart" block for macros.`;

    let formattedHistory = [];
    if (history.length > 0) {
      formattedHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    }

    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: 'text/plain', // Using plain text so it can stream line by line easily
      }
    });

    const resultStream = await chat.sendMessageStream(prompt);

    let buffer = '';
    
    for await (const chunk of resultStream) {
      const text = chunk.text();
      buffer += text;
      
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        
        if (line) {
          try {
            JSON.parse(line); // validate JSON
            res.write(`data: ${line}\n\n`);
          } catch (err) {
            // ignore malformed lines for now, or log them
          }
        }
      }
    }

    // Flush remaining buffer
    if (buffer.trim()) {
      try {
        JSON.parse(buffer.trim());
        res.write(`data: ${buffer.trim()}\n\n`);
      } catch (err) {
        // ignore
      }
    }

    res.write('event: done\ndata: {}\n\n');
    res.end();

  } catch (error) {
    console.error('Error generating AI response:', error);
    res.write(`event: error\ndata: {"code": "PROVIDER_ERROR"}\n\n`);
    res.end();
  }
});

module.exports = router;
