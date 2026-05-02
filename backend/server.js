const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for the frontend
app.use(express.json());

// Simple in-memory cache (Query -> Results)
const cache = {};

// --- SEARCH PROXY ---
app.get('/api/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  // 1. Check if we have this result in cache
  if (cache[q]) {
    console.log(`[Cache] Serving results for: "${q}"`);
    return res.json(cache[q]);
  }

  // 2. If not in cache, call Spoonacular
  try {
    console.log(`[API] Fetching results for: "${q}" from Spoonacular`);
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        apiKey: process.env.SPOONACULAR_API_KEY,
        query: q,
        number: 12,
        addRecipeInformation: true
      }
    });

    // 3. Store result in cache and send to user
    cache[q] = response.data.results;
    res.json(response.data.results);
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response?.status === 402) {
      return res.status(402).json({ error: 'Daily API quota reached. Please try again tomorrow.' });
    }
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch recipes from provider.' 
    });
  }
});

// --- DETAILS PROXY ---
const detailsCache = {};

app.get('/api/recipe/:id', async (req, res) => {
  const { id } = req.params;

  if (detailsCache[id]) {
    console.log(`[Cache] Serving details for ID: ${id}`);
    return res.json(detailsCache[id]);
  }

  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
      params: { apiKey: process.env.SPOONACULAR_API_KEY }
    });

    detailsCache[id] = response.data;
    res.json(response.data);
  } catch (error) {
    console.error('Details API Error:', error.message);
    if (error.response?.status === 402) {
      return res.status(402).json({ error: 'Daily API quota reached.' });
    }
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch recipe details.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
