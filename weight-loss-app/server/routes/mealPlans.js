const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const MealPlan = require('../models/MealPlan');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

const validId = (id) => mongoose.isValidObjectId(id);

router.get('/savedMealPlans', isAuthenticated, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.json({ mealPlans });
  } catch (error) {
    console.error('Error fetching saved meal plans:', error);
    res.status(500).json({ message: 'Server error fetching saved meal plans.' });
  }
});

router.post('/saveMealPlan', isAuthenticated, async (req, res) => {
  try {
    const p = req.body?.mealPlan;
    if (!p || !Array.isArray(p.meals)) {
      return res.status(400).json({ message: 'Invalid meal plan.' });
    }
    // Whitelist fields so clients can't set userId/_id/createdAt.
    const mealPlan = await MealPlan.create({
      userId: req.session.userId,
      mealPlanNumber: p.mealPlanNumber,
      focus: p.focus,
      stapleFoods: p.stapleFoods,
      meals: p.meals,
      totalCalories: p.totalCalories,
      totalProtein: p.totalProtein,
      recipes: p.recipes,
      stapleFoodConcerns: p.stapleFoodConcerns,
      varietyInStapleFoods: p.varietyInStapleFoods,
      notes: p.notes,
    });
    res.status(201).json({ message: 'Meal plan saved.', id: mealPlan._id });
  } catch (error) {
    console.error('Error saving meal plan:', error);
    res.status(500).json({ message: 'Server error saving meal plan.' });
  }
});

router.delete('/mealPlans/:id', isAuthenticated, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ message: 'Meal plan not found.' });
    const deleted = await MealPlan.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
    if (!deleted) return res.status(404).json({ message: 'Meal plan not found.' });
    res.json({ message: 'Meal plan deleted.' });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ message: 'Server error deleting meal plan.' });
  }
});

// ---------- email export ----------
// Configure with SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / EMAIL_FROM.
// When unset, the endpoint reports that email isn't configured.

let transporter;
function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

function mealPlanEmailText(plan) {
  const lines = [`Focus: ${plan.focus}`, `Staple foods: ${plan.stapleFoods}`];
  if (plan.totalCalories) lines.push(`Daily total: ${plan.totalCalories} calories, ${plan.totalProtein}g protein`);
  lines.push('');
  for (const meal of plan.meals) {
    const protein = meal.protein ?? meal.items.reduce((s, i) => s + (Number(i.protein) || 0), 0);
    lines.push(`${meal.mealType}: ${meal.mealName} (${meal.calories} cal, ${protein}g protein)`);
    for (const i of meal.items) lines.push(`  - ${i.item}: ${i.calories} cal, ${i.protein}g protein`);
    lines.push('');
  }
  if (plan.recipes?.length) {
    lines.push('Dinner recipe ideas:');
    for (const r of plan.recipes) lines.push(`  - ${r.title}: ${r.link}`);
  }
  return lines.join('\n');
}

router.post('/mealPlans/:id/export', isAuthenticated, async (req, res) => {
  try {
    const mailer = getTransporter();
    if (!mailer) {
      return res.status(503).json({ message: "Email export isn't set up on this server yet." });
    }
    if (!validId(req.params.id)) return res.status(404).json({ message: 'Meal plan not found.' });

    const [plan, user] = await Promise.all([
      MealPlan.findOne({ _id: req.params.id, userId: req.session.userId }),
      User.findById(req.session.userId),
    ]);
    if (!plan) return res.status(404).json({ message: 'Meal plan not found.' });
    if (!user?.email) {
      return res.status(400).json({ message: 'Add an email address on your Account page first.' });
    }

    await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Your meal plan: ${plan.focus || 'Meal plan'}`,
      text: mealPlanEmailText(plan),
    });
    res.json({ message: `Meal plan sent to ${user.email}.` });
  } catch (error) {
    console.error('Error exporting meal plan:', error);
    res.status(500).json({ message: 'Could not send the email. Please try again later.' });
  }
});

module.exports = router;
