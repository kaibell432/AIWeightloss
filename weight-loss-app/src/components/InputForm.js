import React, {useState} from 'react';
import './css/InputForm.css'

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

    const feetOptions = Array.from({ length: 5 }, (_, i) => i + 4);
    const inchOptions = Array.from({ length: 12}, (_, i) => i);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.heightFeet || formData.heightInches === '') {
            alert('Please enter your full height.');
            return;
        }

        fetch('/api/getSuggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        })
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error());
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="number" 
                name="age" 
                placeholder='Age' 
                value={formData.age} 
                onChange={handleChange} 
                required 
                />
            </div>

            <div>
                <select name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                required
                >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div>
                <input type="number" 
                name="weight" 
                placeholder='Weight' 
                value={formData.weight} 
                onChange={handleChange} 
                required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="heightFeet">Height:</label>
                <div className="height-select">
                    
                    <select
                        name="heightFeet"
                        value={formData.heightFeet}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Feet</option>
                        {feetOptions.map((feet) => (
                            <option key={feet} value={feet}>
                                {feet} ft
                            </option>
                        ))}
                    </select>

                    <select
                        name="heightInches"
                        value={formData.heightInches}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Inches</option>
                        {inchOptions.map((inch) => (
                            <option key={inch} value={inch}>
                                {inch} in
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <select name="activityLevel" 
                value={formData.activityLevel} 
                onChange={handleChange} 
                required
                >
                    <option value="">Select Activity Level</option>
                    <option value="Sedentary">Sedentary (0 Days Per Week)</option>
                    <option value="Moderate">Moderate (1-3 Days Per Week)</option>
                    <option value="Active">Active (4+ Days Per Week)</option>
                    <option value="Disability">I have a condition that limits or prevents exercise.</option> 
                </select>    
            </div>

            <div>
                <select name="dietaryRestrictions" 
                value={formData.dietaryRestrictions} 
                onChange={handleChange} 
                required
                >
                    <option value="">Select Dietary Restrictions</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="No Restrictions">No Restrictions</option>
                    <option value="Other">Other</option> 
                </select>    
            </div>

            {formData.dietaryRestrictions === 'Other' && (
                <div>
                    <input
                    type="text"
                    name="dietaryRestrictionsOther"
                    placeholder="Please specify"
                    value={formData.dietaryRestrictionsOther}
                    onChange={handleChange}
                    required
                    />
                </div>
            )}

            <div>
                <select name="healthGoals" 
                value={formData.healthGoals} 
                onChange={handleChange} 
                required
                >
                    <option value="">Select Health Goals</option>
                    <option value="Lose Fat">Lose Fat</option>
                    <option value="Build Muscle">Build Muscle</option>
                    <option value="Other">Other</option> 
                </select>    
            </div>

            {formData.healthGoals === 'Other' && (
                <div>
                    <input
                    type="text"
                    name="healthGoalsOther"
                    placeholder="Please specify"
                    value={formData.healthGoalsOther}
                    onChange={handleChange}
                    required
                    />
                </div>
            )}

            <div>
                <button type="submit">Get Suggestions</button>
            </div>
        </form>
    )
}

export default InputForm