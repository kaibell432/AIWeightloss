require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');

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

    Additionally, please select and disclose one of the following weight loss plans based on the user's preferences. Only select a weight loss plan if the health goal selected is not "Build Muscle." The descriptions of each are as follows:
    
    - All may be used with our without weightloss medication.

    Rapid:
    - Lose 3-5 lb/week
    - All medical meals with NO prepped meals per week
    - Learn how to transition out and keep the weight off long term
    - Ideal for a jump start OR if trying to lose more than 30 lb
    - Provides the most structure and convenience

    Moderate:
    - Lose 2-3 lb/week
    - All medical meals with ONE prepped meal per week
    - Learn how to transition out and keep the weight off long term
    - Ideal for a jump start OR if trying to lose more than 30 lb
    - Provides excellent structure and convenience 

    Gradual:
    - Lose 1-2 lb/week
    - All medical meals with 1-2 prepped meals per week
    - Learn how to transition out and keep the weight off long term
    - Can be great for a jump start or for any amount of weight loss
    - Provides very good structure and convenience

    Standard:
    - Weight loss at the patient's own pace
    - All your own prepped meals. Ideal for those who enjoy meal prepping and eating their own meals.
    - For best results, this plan requires logging your food intake so we can guide you with calorie, protein, and carb goals.
    - Ideal plan as you are getting close to your weight loss goal AND for maintenance.

    Ensure that all measurements use the imperial system. Offer recommendations in a supportive tone and remind the user to consult a healthcare professional before making significant changes.`;

    try {
        const suggestions = await model.generateContent(prompt);

        console.log(`Suggestions Generated Successfully! ${suggestions.response.text()}`);
        console.log(`Type of response:`, typeof suggestions.response.text())

        var suggestionsBack = suggestions.response.text();
    
        res.json({ suggestionsBack });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Error fetching suggestions '});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})