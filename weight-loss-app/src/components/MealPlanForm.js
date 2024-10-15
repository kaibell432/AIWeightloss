import React, { useState } from 'react';
import { Form, Input, Button, Dropdown } from 'semantic-ui-react';
import './css/MealPlanForm.css'

function MealPlanForm({ setMealPlanResults }) {
    const [formData, setFormData] = useState({
        stapleFood1: '',
        stapleFood2: '',
        stapleFood3: '',
        dailyCals: '',
        dietaryRestrictions: '',
    });

    const [loading, setLoading] = useState(false);

    const dietaryOptions = [
        { key: 'vegetarian', text: 'Vegetarian', value: 'Vegetarian' },
        { key: 'vegan', text: 'Vegan', value: 'Vegan' },
        { key: 'noRestrictions', text: 'No Restrictions', value: 'No Restrictions' },
        { key: 'other', text: 'Other', value: 'Other' },
    ];

    const dietaryRestrictions =
      formData.dietaryRestrictions === 'Other' ? formData.dietaryRestrictionsOther : formData.dietaryRestrictions;

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
            dietaryRestrictions: dietaryRestrictions,
        };

        fetch('/api/getMealPlan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(`Received data:`, data.mealPlanData);
                setMealPlanResults(data.mealPlanData);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error:', err);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>Meal Plan Generator</h2>
                <p>This tool will generate 7 meal options according to your specifications below.</p>
            </div>
            <Form onSubmit={handleSubmit} loading={loading}>
            <Form.Field
                    control={Input}
                    type="text"
                    name="dailyCals"
                    placeholder="Please enter your daily calorie goal (May be a range)"
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

                {formData.stapleFood1 !== '' && (    
                    <Form.Field
                        control={Input}
                        type="text"
                        name="stapleFood2"
                        placeholder="Please enter an additional staple food (If desired)"
                        value={formData.stapleFood2}
                        onChange={handleChange}
                    />
                )}

                {formData.stapleFood2 !== '' && (    
                    <Form.Field
                        control={Input}
                        type="text"
                        name="stapleFood3"
                        placeholder="Please enter an additional staple food (If desired)"
                        value={formData.stapleFood3}
                        onChange={handleChange}
                    />
                )}

                <Form.Field
                control={Dropdown}
                placeholder="Select dietary restrictions"
                fluid
                selection
                options={dietaryOptions}
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                required
                />

                {/* Other Dietary Restrictions Input */}
                {formData.dietaryRestrictions === 'Other' && (
                <Form.Field
                    control={Input}
                    type="text"
                    name="dietaryRestrictionsOther"
                    placeholder="Please specify"
                    value={formData.dietaryRestrictionsOther}
                    onChange={handleChange}
                    required
                />
                )}

                <Button type="submit">
                    Generate Meals
                </Button>
            </Form>
        </div>
    );

}

export default MealPlanForm;