import React from 'react';

interface ResultScreenProps {
    result: number;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result }) => {
    return (
        <div 
            className="result-screen" 
            role="status" 
            aria-label="Result Screen"
        >
            <h1>Your score is: </h1>
            <h1
                className="result-number"
                aria-label={`Score: ${result}`}
            >
                {result}
            </h1>
        </div>
    );
}; 