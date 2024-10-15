import React from 'react';
import './css/Results.css';

function MealPlanResults({ data }) {
  console.log('MealPlanResults received data:', data);

  if (!data || typeof data !== 'object') {
    return <div>No meal plan data available.</div>;
  }

  const { mealPlans = [], recipes = [], notes = '' } = data;

  if (mealPlans.length === 0) {
    return <div>No meal plans found.</div>;
  }

  return (
    <div className="meal-plan-results">
      <h2>Your Personalized Meal Plan Suggestions</h2>

      {mealPlans.map((plan) => (
        <div key={plan.mealPlanNumber} className="meal-plan-container">
          {/* Render the meal plan details */}
        </div>
      ))}

      {/* Render recipes and notes */}
    </div>
  );
}

export default MealPlanResults;
