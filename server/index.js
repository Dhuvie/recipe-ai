require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const recipeRoutes = require('./routes/recipe');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow CORS for local development (will be ignored in production if served together)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api/recipe', recipeRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  // Point to the built Vite files
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Catch-all route to serve React's index.html for unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
