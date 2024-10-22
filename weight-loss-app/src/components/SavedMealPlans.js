import React, { useState, useEffect } from 'react';
import { Card, Button, Message } from 'semantic-ui-react';
// import './css/SavedMealPlans.css';

function SavedMealPlans() {
    const [mealPlans, setMealPlans] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMealPlans = async () => {
            try {
                const response = await fetch('/api/savedMealPlans', {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setMealPlans(data.mealPlans);
                } else {
                    setError(data.message || 'Failed to fetch saved meal plans');
                }
            } catch (err) {
                console.error('Error fetching saved meal plans:', err);
                setError('An error occurred while fetching saved meal plans.');
            }
        };

        fetchMealPlans();
    }, []);

    if (error) {
        return <Message negative>{error}</Message>
    }

    if (mealPlans.length === 0) {
        return <p>You have no saved meal plans</p>
    }

    return (
        <div className="saved-meal-plans">
            <Card.Group>
                {mealPlans.map((plan) => (
                    <Card key={plan._id}>
                        <Card.Content>
                            <Card.Header>Meal Plan {plan.mealPlanNumber}</Card.Header>
                            <Card.Meta>{plan.focus}</Card.Meta>
                            <Card.Description>
                                {/*Filler*/}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Button
                                basic
                                primary
                                onClick={() => {

                                }}
                            >
                                View Details
                            </Button>
                        </Card.Content>
                    </Card>
                ))}
            </Card.Group>
        </div>
    );
}

export default SavedMealPlans;