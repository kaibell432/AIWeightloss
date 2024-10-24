import React, { useState, useEffect } from 'react';
import { Card, Button, Message, Modal, Header, Confirm } from 'semantic-ui-react';
import './css/SavedMealPlans.css';
import MealPlanDetails from './MealPlanDetails';

function SavedMealPlans() {
    const [mealPlans, setMealPlans] = useState([]);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedMealPlan, setSelectedMealPlan] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [message, setMessage] = useState('');

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

    const handleViewDetails = (plan) => {
        setSelectedMealPlan(plan);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMealPlan(null);
    };

    const handleDeleteClick = (plan) => {
        setPlanToDelete(plan);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`/api/mealPlans/${planToDelete._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Meal plan deleted successfully.');
                setMealPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== planToDelete._id));
            } else {
                setError(data.message || 'Failed to delete meal plan.');
            }
        } catch (err) {
            console.error('Error deleting meal plan', err);
            setError('An error occurred while deleting the meal plan.');
        } finally {
            setConfirmOpen(false);
            setPlanToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setPlanToDelete(null);
    };

    if (error) {
        return <Message negative>{error}</Message>
    }

    if (mealPlans.length === 0) {
        return <p>You have no saved meal plans</p>
    }

    return (
        <div className="saved-meal-plans">
            <Card.Group className="meal-cards">
                {mealPlans.map((plan) => (
                    <Card key={plan._id}>
                        <Card.Content>
                            <Card.Header>Staple Foods: {plan.stapleFoods}</Card.Header>
                            <Card.Meta>Focus: {plan.focus}</Card.Meta>
                            <Card.Description>
                                {/*Filler*/}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Button
                                basic
                                primary
                                className="view-meal-button"
                                onClick={() => handleViewDetails(plan)}
                            >
                                View Details
                            </Button>
                        </Card.Content>
                        <Card.Content extra>
                            <Button
                                basic
                                color="red"
                                className="delete-meal-button"
                                onClick={() => handleDeleteClick(plan)}
                            >
                                Delete Meal
                            </Button>
                        </Card.Content>
                    </Card>
                ))}
            </Card.Group>

            <Confirm 
                open={confirmOpen}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                content="Are you sure you want to delete this meal plan?"
                confirmButton="Delete"
                cancelButton="Cancel"
            />

            {selectedMealPlan && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    size="large"
                    closeIcon
                >
                    <Header icon="food" content={selectedMealPlan.title || `Staple Food(s): ${selectedMealPlan.stapleFoods}`} />
                    <Modal.Content scrolling>
                        <MealPlanDetails mealPlan={selectedMealPlan} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="grey" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}
        </div>
    );
}

export default SavedMealPlans;