require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const { use } = require('react');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.post('/api/getSuggestions', async (req, res) => {
    const userInput = req.body;

    const prompt = `As a certified nutritionist, provide personalized weight loss advice based on the following information:

    - Age: ${userInput.age}
    - Gender: ${userInput.gender}
    - Weight: ${userInput.weight} lb
    - Height: ${userInput.heightCm} cm
    - Dietary Restrictions: ${userInput.dietaryRestrictions}
    - Health Goals: ${userInput.healthGoals}

    Additionally, please produce a recommended number of daily calories for the user's meals. I will be using this data to produce some weekly meal plans for the users.

    Ensure that all measurements use the imperial system. Additionally, if you decide to mention the user's BMI, mention that BMI is not a great measure of body composition and the reasons for that.
    Offer recommendations in a supportive tone and remind the user to consult a healthcare professional before making significant changes.`;

    try {
        const weightLossSuggestions = await model.generateContent(prompt);

        console.log(`Suggestions Generated Successfully! ${weightLossSuggestions.response.text()}`);
        console.log(`Type of response:`, typeof weightLossSuggestions.response.text())

        var weightLossSuggestionsBack = weightLossSuggestions.response.text();
    
        res.json({ weightLossSuggestionsBack });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Error fetching suggestions '});
    }
});

app.post('/api/getMealPlan', async (req, res) => {
    const userInput = req.body;

    const prompt = ` 
    As a certified nutritionist, provide exactly 7 suggestions of personalized meal plans with a variety of focuses that find ways to implement up to 3 staple foods inputted by the user. 
    Only require the user to add a minimum of 1 staple food. The user will also provide any dietary restrictions they may have.
    You may use Breakfast, Lunch, Dinner, Snack as the meal types. Additionally, canvass the web and suggest 3 specific recipes, make sure to include links.

    - Daily Calorie Goal: ${userInput.dailyCals}
    - Staple Food 1: ${userInput.stapleFood1}
    - Staple Food 2: ${userInput.stapleFood2}
    - Staple Food 3: ${userInput.stapleFood3}
    - Dietary Restrictions: ${userInput.dietaryRestrictions}

        - Formatting:
        ## Personalized Meal Plans with Staple Foods: Staple Food 1, Staple Food 2, Staple Food 3

        **Daily Calorie Goal: Daily Calorie Goal**

        **Note:** Calorie data is sourced from the USDA Food Composition Database.    

        **Meal Plan Number: Meal Plan Number Focus**

        **Focus Notes:** High protein, moderate carbohydrates, moderate fat

        * **Meal Name (calories):** Item (calories)

        * **Staple Food Concerns:** 
        * **Variety in Staple Foods:** 
    
        
        ## Specific Recipe Suggestions ##
        * **Recipe number:** Recipe Title (link)
    
        **Important Note:**  This is a general guide, and individual needs may vary. It's crucial to consult a registered dietitian for a personalized meal plan tailored to your specific health goals and dietary restrictions. 
    End formatting
    
    - Additional Notes: 
        - Make sure that you provide acurrate calorie data by using the USDA's food database.
        - Ensure that you include the focuses of each meal suggestion (i.e. Proteins, Vegetables, Fiber, Carbs, etc.)
        - Ensure that you always let the user know the source of your calorie data.
        - If any of the staple foods make it difficult to achieve the proper calorie goals, let the user know what you suggest replacing the items with and why.`;

    try {
        const mealPlanSuggestions = await model.generateContent(prompt);

        console.log(`Suggestions Generated Successfully! ${mealPlanSuggestions.response.text()}`);
        console.log(`Type of response:`, typeof mealPlanSuggestions.response.text())

        var mealPlanSuggestionsBack = mealPlanSuggestions.response.text();
    
        res.json({ mealPlanSuggestionsBack });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Error fetching suggestions '});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})