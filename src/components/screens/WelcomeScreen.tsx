import React from 'react';

interface WelcomeScreenProps {
    message: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ message }) => {
    return (
        <div 
            className="welcome-message" 
            role="status" 
            aria-label="Welcome Message"
        >
            <p>{message}</p>
        </div>
    );
}; 