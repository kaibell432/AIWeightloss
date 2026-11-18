const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  { item: String, calories: Number, protein: Number },
  { _id: false }
);

const MealSchema = new mongoose.Schema(
  {
    mealType: String,
    mealName: String,
    calories: Number,
    protein: Number,
    items: [ItemSchema],
  },
  { _id: false }
);

const MealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  mealPlanNumber: Number,
  focus: String,
  stapleFoods: String,
  meals: [MealSchema],
  totalCalories: Number,
  totalProtein: Number,
  // Recipes live at the plan level (previously the schema put them inside each
  // meal, so they were silently dropped on save).
  recipes: [{ title: String, link: String, _id: false }],
  stapleFoodConcerns: String,
  varietyInStapleFoods: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
