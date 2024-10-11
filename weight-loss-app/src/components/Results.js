import React from 'react';
import './css/Results.css';
import ReactMarkdown from 'react-markdown';

function Results({ data }) {

    const suggestionsString = data.suggestionsBack;

    return (
        <div className="results">
            <h2>Your Personalized Weight Loss Suggestions</h2>
            <ReactMarkdown>{suggestionsString}</ReactMarkdown>
        </div>
    );
}

export default Results;