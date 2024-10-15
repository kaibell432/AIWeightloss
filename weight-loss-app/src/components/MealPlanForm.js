import React, { useState } from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import './css/InputForm.css'

function MealPlanForm({ setMealPlanResults }) {
    const [formData, setFormData] = useState({
        stapleFood1: '',
        stapleFood2: '',
        stapleFood3: '',
        dailyCals: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e, { name, value }) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(`Begin loading`);

        const dataToSend = {
            stapleFood1: formData.stapleFood1,
            stapleFood2: formData.stapleFood2,
            stapleFood3: formData.stapleFood3,
            dailyCals: formData.dailyCals,
        };

        fetch('/api/getMealPlan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(`Received data:`, data.mealPlanSuggestionsBack);
                setMealPlanResults(data.mealPlanSuggestionsBack);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error:', err);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <Form onSubmit={handleSubmit} loading={loading}>
            <Form.Field
                    control={Input}
                    type="text"
                    name="dailyCals"
                    placeholder="Please Enter Your Daily Calorie Goal (May be a range)"
                    value={formData.dailyCals}
                    onChange={handleChange}
                    required
                />

                <Form.Field
                    control={Input}
                    type="text"
                    name="stapleFood1"
                    placeholder="Please enter a staple food (Up to 3)"
                    value={formData.stapleFood1}
                    onChange={handleChange}
                    required
                />

                {formData.stapleFood1 != '' && (    
                    <Form.Field
                        control={Input}
                        type="text"
                        name="stapleFood2"
                        placeholder="Please enter an additional staple food (If desired)"
                        value={formData.stapleFood2}
                        onChange={handleChange}
                    />
                )}

                {formData.stapleFood2 != '' && (    
                    <Form.Field
                        control={Input}
                        type="text"
                        name="stapleFood3"
                        placeholder="Please enter an additional staple food (If desired)"
                        value={formData.stapleFood3}
                        onChange={handleChange}
                    />
                )}

                <Button type="submit">
                    Get Meal Plans
                </Button>
            </Form>
        </div>
    );

}

export default MealPlanForm;