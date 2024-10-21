const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

const getRecipes = async (params) => {
    const baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';
    try {
        const response = await axios.get(baseUrl, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                ...params
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes from Spoonacular:', error);
        throw error;
    }
};

module.exports = { getRecipes };