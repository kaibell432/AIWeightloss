import React from 'react';
import './css/Results.css';
import ReactMarkdown from 'react-markdown';

function MealPlanResults({ data }) {

    return (
        <div className="meal-plan-results">
            <h2>Your Personalized Meal Plan Suggestions</h2>
            <ReactMarkdown>{data}</ReactMarkdown>
        </div>
    );
}

export default MealPlanResults;