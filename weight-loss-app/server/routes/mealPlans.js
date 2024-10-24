const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const MealPlan = require('../models/MealPlan');
const User = require('../models/User');

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

// Export meal plan via email
router.post('/mealPlans/:id/export', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const mealPlan = await MealPlan.findOne({ _id: id, userId: req.session.userId });
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        const user = await User.findById(req.session.userId);
        if (!user || !user.email) {
            return res.status(400).json({ message: 'No email address associated with this account' });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'lelia.beatty@ethereal.email',
                pass: 'nUemzFtzBtF9aS2sW4'
            }
        });

        const mealPlanContent = generateMealPlanEmailContent(mealPlan);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Your Meal Plan: ${mealPlan.title || mealPlan.focus || 'Meal Plan'}`,
            text: mealPlanContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent:', info.response);
                return res.json({ message: 'Meal plan sent to your email successfully!' })
            }
        });
    } catch (error) {
        console.error('Error exporting meal plan:', error);
        res.status(500).json({ message: 'Server error exporting meal plan' });
    }
});

// Generate email content
function generateMealPlanEmailContent(mealPlan) {
    let content = `Focus: ${mealPlan.focus}\n\n`;

    content += 'Meals:\n';
    mealPlan.meals.forEach((meal) => {
        content += `${meal.mealType} ${meal.mealName}\n`;
        content += `Calories: ${meal.calories}\n`;
        const totalProtein = meal.items.reduce((sum, item) => sum + Number(item.protein || 0), 0);
        content += `Protein: ${totalProtein}g\n`;
        content += `Items:\n`;
        meal.items.forEach((item) => {
            content += `- ${item.item} - ${item.calories} calories, ${item.protein}g protein\n`;
        });
        content += `\n`;
    });

    return content;
}

module.exports = router;