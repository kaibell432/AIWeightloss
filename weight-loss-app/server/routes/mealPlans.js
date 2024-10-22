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

// Delete Meal
router.delete('/mealPlans/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlan = await MealPlan.findOneAndDelete({ _id: id, userId: req.session.userId });

        if (!deletedPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting meal plan:', error);
        res.status(500).json({ message: 'Server error deleting meal plan' })
    }
});

module.exports = router;