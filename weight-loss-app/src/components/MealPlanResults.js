import React from 'react';
import './css/MealPlanResults.css';
import { Button } from 'semantic-ui-react';

function MealPlanResults({ data }) {
  console.log('MealPlanResults received data:', data);

  if (!data || typeof data !== 'object') {
    return <div>No meal plan data available.</div>;
  }

  const { mealPlans = [], recipes = [], notes = '' } = data;

  if (mealPlans.length === 0) {
    return <div>No meal plans found.</div>;
  }

  // Meal plan saving placeholder
  const handleSaveMealPlan = (plan) => {
    console.log('Saving meal plan:', plan);
  };

  return (
    <div className="meal-plan-results">
      <h2>Your Personalized Meal Plan Suggestions</h2>

      {mealPlans.map((plan) => (
        <div key={plan.mealPlanNumber} className="meal-plan-container">
          <h3>
            Meal Plan {plan.mealPlanNumber}: {plan.focus}
          </h3>
          <p>
            <strong>Staple Food Concers:</strong> {plan.stapleFoodConcerns}
          </p>
          <p>
            <strong>Variety in Staple Foods:</strong> {plan.varietyInStapleFoods}
          </p>

          <h4>Meals:</h4>
          <ul>
            {plan.meals.map((meal, index) => (
                <li key={index} className="meal-item">
                    <strong>
                        {meal.mealType}: {meal.mealName} ({meal.calories} calories)
                    </strong>
                    <ul>
                        {meal.items.map((item, idx) => (
                            <li key={idx}>
                                {item.item} ({item.calories} calories)
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
        
        <Button onClick={() => handleSaveMealPlan(plan)} className="save-button">
            Save meal
        </Button>

    </div>
))}

    <h2>Specific Recipe Suggestions</h2>
    <ul>
        {recipes.map((recipe) => (
            <li key={recipe.recipeNumber}>
                <a href={recipe.link} target="_blank" rel="noopener noreferrer">
                    {recipe.title}
                </a>
            </li>
        ))}
    </ul>

</div>
  );
}

export default MealPlanResults;
