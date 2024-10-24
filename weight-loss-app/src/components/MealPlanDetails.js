import React, { useState, useEffect } from 'react';
import { List, Segment, Header, Button, Message } from 'semantic-ui-react';

function MealPlanDetails({ mealPlan }) {
    const [userEmail, setUserEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const response = await fetch('/api/user', {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setUserEmail(data.user.email || '');
                } else {
                    setError(data.message || 'Failed to fetch user email');
                }
            } catch (err) {
                console.error('Error fetching user email:', err);
                setError('An error occurred while fetching user email');
            }
        };

        fetchUserEmail();
    }, []);

    const handleExportEmail = async () => {
        if (!userEmail) {
            setError('You need to add an email to your account to export meal plan');
            return;
        }

        try {
            const response = await fetch(`/api/mealPlans/${mealPlan._id}/export`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Meal plan successfully sent to your email!');
                setError('');
            } else {
                setError(data.message || 'Failed to send meal plan via email')
                setMessage('');
            }
        } catch (err) {
            console.error('Error sending meal via email:', err);
            setError('An error occurred while sending the meal plan via email');
            setMessage('');
        }
    }
 
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
            {message && <Message positive>{message}</Message>}
            {error && <Message negative>{error}</Message>}

            <Button className="email-button" onClick={handleExportEmail}>
                Export via Email
            </Button>
        </div>
    )
}

export default MealPlanDetails;