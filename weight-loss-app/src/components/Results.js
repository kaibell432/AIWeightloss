import React from 'react';

function Results({ data }) {
    return (
        <div className="results">
            <h2>Your Personalized Weight Loss Suggestions</h2>
            <p>{data.suggestions}</p>
        </div>
    );
}

export default Results;