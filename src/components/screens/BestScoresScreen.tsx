import React from 'react';

interface BestScoresScreenProps {
    scores: number[];
}

export const BestScoresScreen: React.FC<BestScoresScreenProps> = ({ scores }) => {
    return (
        <div className="best-scores">
            <h1>HIGH SCORES</h1>
            <div className="best-scores-list" aria-label="List of best scores">
                <ol >
                    {scores.map((score, index) => (
                        <li
                            key={`score-${index}`}
                            aria-label={`Score ${index + 1}: ${score}`}
                        >
                            {score}
                        </li>
                    ))}
                </ol>
            </div>

        </div>
    );
}; 