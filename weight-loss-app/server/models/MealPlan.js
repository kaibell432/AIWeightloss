const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mealPlanNumber: Number,
    focus: String,
    stapleFoods: String,
    meals: [
        {
            mealType: String,
            mealName: String,
            calories: Number,
            protein: Number,
            items: [
                {
                    item: String,
                    calories: Number,
                    protein: Number,
                },
            ],
            recipe: {
                title: String,
                link: String,
            },
        },
    ],
    stapleFoodConcerns: String,
    varietyInStapleFoods: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);