const express = require('express');
const rateLimit = require('express-rate-limit');
const { generate } = require('../lib/gemini');
const P = require('../lib/prompts');

const router = express.Router();

// Protects the free Gemini quota from being drained by one visitor or a bot.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AI_RATE_LIMIT || 15),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a few minutes and try again.' },
});

// ---------- input helpers ----------

const text = (v, max = 80) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
const int = (v, min, max) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

function sendAiError(res, err, fallbackMsg) {
  console.error(fallbackMsg, err.cause?.message || err.message);
  if (err.status === 429) {
    return res.status(429).json({ error: 'The AI service is at its free usage limit right now. Please try again later.' });
  }
  res.status(503).json({ error: `${fallbackMsg} The AI service may be busy, so please try again in a moment.` });
}

// ---------- weight suggestions ----------

router.post('/getSuggestions', aiLimiter, async (req, res) => {
  const b = req.body || {};
  const input = {
    age: int(b.age, 13, 120),
    gender: text(b.gender, 20),
    weight: int(b.weight, 50, 1000),
    heightFeet: int(b.heightFeet, 3, 8),
    heightInches: int(b.heightInches, 0, 11),
    activityLevel: text(b.activityLevel, 60),
    dietaryRestrictions: text(b.dietaryRestrictions, 120) || 'None',
    healthGoals: text(b.healthGoals, 120),
  };

  const missing = Object.entries(input).filter(([, v]) => v === null || v === '').map(([k]) => k);
  if (missing.length) {
    return res.status(400).json({ error: `Please check these fields: ${missing.join(', ')}` });
  }

  try {
    const { data, model } = await generate({
      system: P.SYSTEM,
      prompt: P.suggestionsPrompt(input),
      schema: P.suggestionsSchema,
    });
    res.json({ suggestions: data, model });
  } catch (err) {
    sendAiError(res, err, 'Could not generate suggestions.');
  }
});

// ---------- meal plans ----------

const sum = (arr, key) => arr.reduce((s, x) => s + (Number(x[key]) || 0), 0);
const recipeLink = (title) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${title} recipe`)}`;

// Recompute totals from line items instead of trusting the model's arithmetic,
// and build recipe search links instead of trusting model-invented URLs.
function normalizeMealPlans(data) {
  const mealPlans = (data.mealPlans || []).map((plan, i) => {
    const meals = (plan.meals || []).map((meal) => {
      const items = (meal.items || []).map((it) => ({
        item: it.item,
        calories: Math.round(Number(it.calories) || 0),
        protein: Math.round(Number(it.protein) || 0),
      }));
      return { mealType: meal.mealType, mealName: meal.mealName, items, calories: sum(items, 'calories'), protein: sum(items, 'protein') };
    });
    return {
      mealPlanNumber: i + 1,
      focus: plan.focus,
      stapleFoods: plan.stapleFoods,
      meals,
      totalCalories: sum(meals, 'calories'),
      totalProtein: sum(meals, 'protein'),
      recipes: (plan.recipes || []).slice(0, 2).map((title) => ({ title, link: recipeLink(title) })),
      stapleFoodConcerns: data.stapleFoodConcerns || '',
      varietyInStapleFoods: data.varietyInStapleFoods || '',
    };
  });
  return {
    mealPlans,
    stapleFoodConcerns: data.stapleFoodConcerns || '',
    varietyInStapleFoods: data.varietyInStapleFoods || '',
    notes: 'Nutrition values are AI estimates based on USDA FoodData Central and may vary. Recipe links open a web search.',
  };
}

router.post('/getMealPlan', aiLimiter, async (req, res) => {
  const b = req.body || {};
  const input = {
    dailyCals: text(b.dailyCals, 30),
    stapleFood1: text(b.stapleFood1, 60),
    stapleFood2: text(b.stapleFood2, 60),
    stapleFood3: text(b.stapleFood3, 60),
    dietaryRestrictions: text(b.dietaryRestrictions, 120) || 'None',
  };

  if (!/\d{3,5}/.test(input.dailyCals)) {
    return res.status(400).json({ error: 'Please enter a daily calorie goal, like 1800 or 1800-2000.' });
  }
  if (!input.stapleFood1) {
    return res.status(400).json({ error: 'Please enter at least one staple food.' });
  }

  try {
    const { data, model } = await generate({
      system: P.SYSTEM,
      prompt: P.mealPlanPrompt(input),
      schema: P.mealPlanSchema,
    });
    res.json({ mealPlanData: normalizeMealPlans(data), model });
  } catch (err) {
    sendAiError(res, err, 'Could not generate meal plans.');
  }
});

module.exports = router;
