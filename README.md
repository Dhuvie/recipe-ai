# Fridge to Recipe App

A React and Vite frontend with a lightweight Express backend proxy. The user inputs ingredients, the backend securely calls Gemini's structured output API, and the frontend parses and renders it as an interactive UI.

## Setup Steps

1. Install backend dependencies
cd server
npm install

2. Install frontend dependencies
cd client
npm install

3. Configure environment variables
In the `server` directory, copy `.env.example` to `.env` and add your Gemini API key.
GEMINI_API_KEY=your_actual_key

4. Start the backend server
In the `server` directory, run:
node index.js

5. Start the frontend server
In the `client` directory, run:
npm run dev

The app will be available at http://localhost:5173

## AI Usage Note

I used AI to generate the boilerplate code for Vite, React components, CSS styling, and the Express backend. AI was also used to quickly write the Zod schema and API connection logic to interface with Gemini. I fully understand and can explain all the generated code.

## Known Limitations

- The API timeout is hardcoded to 20 seconds on the backend and 25 seconds on the frontend.
- The UI handles errors gracefully but does not currently retry automatically.
- State is not persisted between page reloads.

## Time Spent

Approximately 3 hours.
