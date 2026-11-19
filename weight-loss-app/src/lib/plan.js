// Meal plan helpers shared by the planner and saved plans.

const sumProtein = (items) => items.reduce((s, i) => s + (Number(i.protein) || 0), 0);

// Parses "1800", "1800-2000", "1,800 to 2,000" into { min, max }.
export function parseCalorieGoal(text = '') {
  const nums = (String(text).replace(/,/g, '').match(/\d{3,5}/g) || []).map(Number);
  if (!nums.length) return null;
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

export function planTotals(plan) {
  const calories = plan.totalCalories ?? plan.meals.reduce((s, m) => s + (Number(m.calories) || 0), 0);
  const protein = plan.totalProtein ?? plan.meals.reduce((s, m) => s + (m.protein ?? sumProtein(m.items)), 0);
  return { calories, protein };
}

// Within 5% of the goal range counts as on target.
export function goalStatus(calories, goal) {
  if (!goal) return null;
  if (calories > goal.max * 1.05) return 'over';
  if (calories < goal.min * 0.95) return 'under';
  return 'ok';
}
