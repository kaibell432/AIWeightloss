const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

// Get Saved Meals
router.get('/savedMealPlans', isAuthenticated, async (req, res) => {
    try {
        const mealPlans = await MealPlan.find({ userId: req.session.userId });
        res.json({ mealPlans });
    } catch (error) {
        console.error('Error fetching saved meals:', error);
        res.status(500).json({ message: 'Server error fetching saved meals' });
    }
});

module.exports = router;