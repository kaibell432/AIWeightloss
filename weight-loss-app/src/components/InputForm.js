import React, {useState} from 'react';

function InputForm({ setResults }) {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        weight: '',
        height: '',
        activityLevel: '',
        dietaryPreferences: '',
        healthGoals: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
            <input type="number" name="age" placeholder='Age' value={formData.age} onChange={handleChange} required />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="">Female</option>
                <option value="">Male</option>
                <option value="">Other</option>
            </select>
            <button type="submit">Get Suggestions</button>
        </form>
    )
}

export default InputForm