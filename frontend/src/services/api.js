import axios from 'axios';

/**
 * api.js (Frontend Service)
 * 
 * Now updated to call our local Backend Proxy instead of 
 * calling Spoonacular directly. This hides our API key 
 * and enables server-side caching.
 */

const BASE_URL = 'http://localhost:5000/api';

/**
 * Search recipes via our backend proxy
 */
export const searchRecipes = async (query, number = 12) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

/**
 * Get recipe details via our backend proxy
 */
export const getRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipe/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};
