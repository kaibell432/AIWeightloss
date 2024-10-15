require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const { use } = require('react');
const cors = require('cors');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

/*app.use (
    session({
        secret: 'session_secret', // Replace with a secure secret
        resave: false,
        saveUninitialized: false,
        // cookie { secure: true } // Use secure cookies in production with https
    })
);
*/
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
As a certified nutritionist, provide exactly 7 suggestions of personalized meal plans with a variety of focuses that find ways to implement up to 3 staple foods inputted by the user. Only require the user to add a minimum of 1 staple food. The user will also provide any dietary restrictions they may have. You may use Breakfast, Lunch, Dinner, Snack as the meal types. Additionally, canvass the web and suggest the specific dinner recipe for each of the 7 plans; make sure to include links.

- Daily Calorie Goal: ${userInput.dailyCals}
- Staple Food 1: ${userInput.stapleFood1}
- Staple Food 2: ${userInput.stapleFood2}
- Staple Food 3: ${userInput.stapleFood3}
- Dietary Restrictions: ${userInput.dietaryRestrictions}

**Important Instructions:**

- Output the meal plans and recipes in **valid JSON format only**.
- Ensure there are **no trailing commas** in arrays or objects.
- Do **not** include any additional explanations or text outside of the JSON.
- Do **not** include any markdown formatting or code blocks.
- The JSON should be properly formatted and parseable.

**The JSON structure should be as follows:**

{
  "mealPlans": [
    {
      "mealPlanNumber": 1,
      "focus": "Focus Description",
      "meals": [
        {
          "mealType": "Meal Type",
          "mealName": "Meal Name",
          "calories": 0,
          "items": [
            { "item": "Item Name", "calories": 0 }
          ]
        }
        // Include additional meal objects as needed
      ],
      "recipe": [
      {
        "recipeNumber": num,
        "title": "Recipe Title",
        "link": "Recipe Link"
      }
      ],
      "stapleFoodConcerns": "Any concerns",
      "varietyInStapleFoods": "Variety description"
    }
    // Include additional meal plan objects up to 7 in total
  ],
  "notes": "Calorie data is sourced from the USDA Food Composition Database."
}

**Additional Notes:**

- The "mealPlans" array should contain **exactly 7 meal plan objects**.
- Each "meals" array should contain multiple meal objects (e.g., Breakfast, Lunch, Dinner, Snack).
- The "recipes" array should contain **exactly 3 recipe objects**.

**Important Notes:**

- Provide accurate calorie data by using the USDA's food database.
- Include the focuses of each meal suggestion (e.g., Proteins, Vegetables, Fiber, Carbs, etc.).
- Always let the user know the source of your calorie data.
- If any staple foods make it difficult to achieve proper calorie goals, let the user know what you suggest replacing the items with and why.

    `;

    try {
        const mealPlanSuggestions = await model.generateContent(prompt);

        const generatedText = mealPlanSuggestions.response.text();

        // Extract JSON
        const jsonStartIndex = generatedText.indexOf('{');
        const jsonEndIndex = generatedText.lastIndexOf('}') + 1;
        const jsonString = generatedText.substring(jsonStartIndex, jsonEndIndex);

        let mealPlanData;
        try {
            mealPlanData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Error parsing JSON: ', parseError);
            console.error('Generated Text: ', generatedText);
            return res.status(500).json({ error: 'Error parsing meal plan data' });
        }

        res.json({ mealPlanData });
    } catch (error) {
        console.error('Error fetching meal plan: ', error);
        res.status(500).json({ error: 'Error fetching meal plan' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})