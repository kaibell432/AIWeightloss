import React from 'react';
import { List, Segment, Header } from 'semantic-ui-react';

function MealPlanDetails({ mealPlan }) {
    return (
        <div>
            <Header as="h3">Focus: {mealPlan.focus}</Header>

            <Segment>
                <Header as="h4">Meals:</Header>
                <List divided relaxed>
                    {mealPlan.meals.map((meal, index) => {
                        const totalProtein = meal.items.reduce((sum, item) => sum + item.protein, 0);
                        
                        return(
                            <List.Item key={index}>
                            <List.Content>
                                <List.Header>{meal.mealType}: {meal.mealName}</List.Header>
                                <List.Description>
                                    <p>Calories: {meal.calories}</p>
                                    <p>Protein: {totalProtein}g</p>
                                    <p>Items</p>
                                    <List bulleted>
                                        {meal.items.map((item, idx) => (
                                            <List.Item key={idx}>
                                                {item.item} - {item.calories} calories, {item.protein}g protein
                                            </List.Item>
                                        ))}
                                    </List>
                                </List.Description>
                            </List.Content>
                        </List.Item>
                        );
                    })}
                </List>
            </Segment>
        </div>
    )
}

export default MealPlanDetails;