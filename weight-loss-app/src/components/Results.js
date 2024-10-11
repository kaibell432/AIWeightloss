import React from 'react';
import './css/Results.css';

function Results({ data }) {

    const suggestionsString = data.suggestionsBack;

    return (
        <div className="results">
            <h2>Your Personalized Weight Loss Suggestions</h2>
            <p>{suggestionsString}</p>
        </div>
    );
}

export default Results;