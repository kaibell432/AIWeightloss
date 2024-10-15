// src/InputForm.js

import React, { useState } from 'react';
import { Form, Input, Dropdown, Button } from 'semantic-ui-react';
import './css/InputForm.css';

function InputForm({ setResults }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    heightFeet: '',
    heightInches: '',
    activityLevel: '',
    dietaryRestrictions: '',
    dietaryRestrictionsOther: '',
    healthGoals: '',
    healthGoalsOther: '',
  });
  const [loading, setLoading] = useState(false);

  // Options for Dropdowns
  const genderOptions = [
    { key: 'female', text: 'Female', value: 'Female' },
    { key: 'male', text: 'Male', value: 'Male' },
    { key: 'other', text: 'Other', value: 'Other' },
  ];

  const feetOptions = Array.from({ length: 5 }, (_, i) => ({
    key: i + 4,
    text: `${i + 4} ft`,
    value: i + 4,
  }));

  const inchOptions = Array.from({ length: 12 }, (_, i) => ({
    key: i,
    text: `${i} in`,
    value: i,
  }));

  const activityOptions = [
    { key: 'sedentary', text: 'Sedentary (0 Days Per Week)', value: 'Sedentary' },
    { key: 'moderate', text: 'Moderate (1-3 Days Per Week)', value: 'Moderate' },
    { key: 'active', text: 'Active (4+ Days Per Week)', value: 'Active' },
    { key: 'limited', text: 'I have a condition that limits or prevents exercise.', value: 'Disability' },
  ];

  const dietaryOptions = [
    { key: 'vegetarian', text: 'Vegetarian', value: 'Vegetarian' },
    { key: 'vegan', text: 'Vegan', value: 'Vegan' },
    { key: 'noRestrictions', text: 'No Restrictions', value: 'No Restrictions' },
    { key: 'other', text: 'Other', value: 'Other' },
  ];

  const healthGoalsOptions = [
    { key: 'loseFat', text: 'Lose Fat', value: 'Lose Fat' },
    { key: 'buildMuscle', text: 'Build Muscle', value: 'Build Muscle' },
    { key: 'other', text: 'Other', value: 'Other' },
  ];

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

    if (!formData.heightFeet || formData.heightInches === '') {
      alert('Please enter your full height.');
      return;
    }

    const totalInches = parseInt(formData.heightFeet) * 12 + parseInt(formData.heightInches);
    const heightCm = totalInches * 2.54;

    const dietaryRestrictions =
      formData.dietaryRestrictions === 'Other' ? formData.dietaryRestrictionsOther : formData.dietaryRestrictions;

    const healthGoals =
      formData.healthGoals === 'Other' ? formData.healthGoalsOther : formData.healthGoals;

    const dataToSend = {
      age: formData.age,
      gender: formData.gender,
      weight: formData.weight,
      heightCm: heightCm,
      activityLevel: formData.activityLevel,
      dietaryRestrictions: dietaryRestrictions,
      healthGoals: healthGoals,
    };

    fetch('/api/getSuggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`Received data:`, data);
        setResults(data);
        setLoading(false);
        console.log(`End loading`);
      })
      .catch((err) => {
        console.error('Error:', err);
        setLoading(false);
        console.log(`End loading`);
      })
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Weight Loss Suggestions</h2>
        <p>This tool will generate specific recommendations to achieve your weight goals based on the information provided below.</p>
      </div>
      <Form onSubmit={handleSubmit} loading={loading}>
        {/* Age Input */}
        <Form.Field
          control={Input}
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        {/* Gender Dropdown */}
        <Form.Field
          control={Dropdown}
          placeholder="Select gender"
          fluid
          selection
          options={genderOptions}
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        />

        {/* Weight Input */}
        <Form.Field>
          <Input
            label={{ basic: true, content: 'lb' }}
            labelPosition="right"
            type="number"
            name="weight"
            placeholder="Weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </Form.Field>

        {/* Height Selection */}
        <Form.Group widths="equal">
          <Form.Field
            control={Dropdown}
            placeholder="Height (Feet)"
            fluid
            selection
            options={feetOptions}
            name="heightFeet"
            value={formData.heightFeet}
            onChange={handleChange}
            required
          />
          <Form.Field
            control={Dropdown}
            placeholder="Height (Inches)"
            fluid
            selection
            options={inchOptions}
            name="heightInches"
            value={formData.heightInches}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Activity Level Dropdown */}
        <Form.Field
          control={Dropdown}
          placeholder="Select activity level"
          fluid
          selection
          options={activityOptions}
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleChange}
          required
        />

        {/* Dietary Restrictions Dropdown */}
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

        {/* Health Goals Dropdown */}
        <Form.Field
          control={Dropdown}
          placeholder="Select health goals"
          fluid
          selection
          options={healthGoalsOptions}
          name="healthGoals"
          value={formData.healthGoals}
          onChange={handleChange}
          required
        />

        {/* Other Health Goals Input */}
        {formData.healthGoals === 'Other' && (
          <Form.Field
            control={Input}
            type="text"
            name="healthGoalsOther"
            placeholder="Please specify"
            value={formData.healthGoalsOther}
            onChange={handleChange}
            required
          />
        )}

        {/* Submit Button */}
        <Button type="submit" primary>
          Get Suggestions
        </Button>
      </Form>

    </div>

    

  );
}

export default InputForm;
