require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const { use } = require('react');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const validator = require('validator');
const { getRecipes } = require('./spoonacular');

const mongoURI = process.env.MONGODB_URI;
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

mongoose
  .connect(mongoURI, {
  })
  .then(()=> console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use (
    session({
        secret: 'session_secret', // Replace with a secure secret
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          collectionName: 'sessions',
        }),
        cookie: { 
          secure: false,
          httpOnly: true, 
          maxAge: 1000 * 60 * 60 * 24,
        },
}));

const port = process.env.PORT;

// Registration Route
app.post('/api/register', async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    username = username.toLowerCase();
    
    // Check if user exists already
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Encrypt Pass
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUserData = new User({
      username,
      password: hashedPass,
    });

    const newUser = new User(newUserData);
    await newUser.save();

    // Auto login after registration
    req.session.userId = newUser._id;

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    let {username, password} = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    username = username.toLowerCase();

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Set user session
    req.session.userId = user._id;

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout Route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Server error during logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Check Auth Endpoint
app.get('/api/checkAuth', (req, res) => {
  if (req.session.userId) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Protected Route Test
app.get('/api/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'You have access to the protected route' });
});

// Get Suggestions
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

// Import necessary modules at the top of your file if not already imported

app.post('/api/getMealPlan', async (req, res) => {
  try {
    const userInput = req.body;

    // Extract user inputs
    const { dailyCals, stapleFood1, stapleFood2, stapleFood3, dietaryRestrictions } = userInput;

    // Sanitize and standardize staple foods
    const stapleFoodsArray = [stapleFood1, stapleFood2, stapleFood3]
      .filter(Boolean)
      .map(food => food.toLowerCase().trim());

    // Log the sanitized staple foods
    console.log('Staple Foods:', stapleFoodsArray);

    // Build staple foods string
    const stapleFoods = stapleFoodsArray.join(',');

    // Map dietary restrictions
    const dietMap = {
      'Vegetarian': 'vegetarian',
      'Vegan': 'vegan',
      'Gluten Free': 'gluten free',
      'Ketogenic': 'ketogenic',
      'Pescetarian': 'pescetarian',
      'Paleo': 'paleo',
      'Primal': 'primal',
      'Whole30': 'whole30',
    };
    const diet = dietMap[dietaryRestrictions] || '';

    // Prepare parameters for Spoonacular API
    const params = {
      number: 7, // Fetch 7 recipes for 7 days
      type: 'main course',
      // diet: diet, // Commented out temporarily to test
      // includeIngredients: stapleFoods, // Commented out temporarily to test
      // maxCalories: dailyCals, // Commented out temporarily to test
      sort: 'random',
      addRecipeInformation: true,
      fillIngredients: true,
    };

    // Log the API parameters
    console.log('Spoonacular API params:', params);

    let recipesData;
    try {
      // Fetch recipes from Spoonacular
      recipesData = await getRecipes(params);
    } catch (error) {
      if (error.response) {
        console.error('Spoonacular API Error:', error.response.data);
      } else {
        console.error('Error fetching recipes from Spoonacular:', error.message);
      }
      return res.status(500).json({ error: 'Error fetching recipes from Spoonacular' });
    }

    // Check if recipes are returned
    if (!recipesData || !recipesData.results || recipesData.results.length === 0) {
      console.error('No recipes found with the given parameters.');
      return res.status(200).json({
        error: 'No recipes found with the given parameters. Please adjust your inputs.',
      });
    }

    const recipes = recipesData.results;

    // Log the number of recipes found
    console.log('Number of recipes found:', recipes.length);

    // Prepare recipe titles to include in the prompt
    const recipeTitles = recipes.map(recipe => recipe.title);

    // Now prepare the prompt for Gemini
    const prompt = `
As a certified nutritionist, please create a 7-day personalized meal plan based on the following information:

- Daily Calorie Goal: ${dailyCals}
- Staple Foods: ${stapleFoodsArray.join(', ')}
- Dietary Restrictions: ${dietaryRestrictions}

**Important Instructions:**

- Incorporate the following dinner recipes into each day's meal plan in order:

${recipeTitles.map((title, index) => `Day ${index + 1}: ${title}`).join('\n')}

- Use Breakfast, Lunch, Dinner, Snack as meal types.
- Output the meal plans in **valid JSON format only**.
- Ensure there are **no trailing commas** in arrays or objects.
- Do **not** include any additional explanations or text outside of the JSON.
- Do **not** include any markdown formatting or code blocks.
- The JSON should be properly formatted and parseable.
- Make sure to include protein in grams.

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
          "protein": 0,
          "items": [
            { "item": "Item Name", "calories": 0 }
          ]
        }
        // Include additional meal objects as needed
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
- The dinner meal for each day should correspond to the provided dinner recipe for that day.

**Important Notes:**

- Provide accurate calorie data by using the USDA's food database.
- Include the focuses of each meal suggestion (e.g., Proteins, Vegetables, Fiber, Carbs, etc.).
- Always let the user know the source of your calorie data.
- If any staple foods make it difficult to achieve proper calorie goals, let the user know what you suggest replacing the items with and why.
    `;

    // Log the prompt (optional, but helpful for debugging)
    console.log('Gemini Prompt:', prompt);

    let mealPlanSuggestions;
    try {
      mealPlanSuggestions = await model.generateContent(prompt);
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      return res.status(500).json({ error: 'Error generating meal plan' });
    }

    const generatedText = mealPlanSuggestions.response.text();

    // Extract JSON
    const jsonStartIndex = generatedText.indexOf('{');
    const jsonEndIndex = generatedText.lastIndexOf('}') + 1;
    const jsonString = generatedText.substring(jsonStartIndex, jsonEndIndex);

    let mealPlanData;
    try {
      mealPlanData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.error('Generated Text:', generatedText);
      return res.status(500).json({ error: 'Error parsing meal plan data' });
    }

    // Add recipe links to the dinner meals
    mealPlanData.mealPlans.forEach((mealPlan, index) => {
      const dinnerMeal = mealPlan.meals.find(meal => meal.mealType.toLowerCase() === 'dinner');
      if (dinnerMeal && recipes[index]) {
        dinnerMeal.recipe = {
          title: recipes[index].title,
          link: recipes[index].sourceUrl,
        };
      }
    });

    res.json({ mealPlanData });
  } catch (error) {
    console.error('Unexpected error in /api/getMealPlan:', error);
    res.status(500).json({ error: 'Server error during meal plan generation' });
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})