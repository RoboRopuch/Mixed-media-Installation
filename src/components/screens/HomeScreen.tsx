import React from 'react';
import { HOME_TITLE, HOME_SUBTITLE } from '../../constants';

interface HomeScreenProps {
    onSpacePress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSpacePress }) => {
    React.useEffect(() => {
        const handleMouseClick = (event: MouseEvent) => {
            if (event.button === 0) { // 0 = left mouse button
                onSpacePress();
            }
        };

        window.addEventListener('mousedown', handleMouseClick);

        return () => {
            window.removeEventListener('mousedown', handleMouseClick);
        };
    }, [onSpacePress]);

    return (
        <div className="home-screen" role="main" aria-label="Home Screen">
            <h1>{HOME_TITLE}</h1>
            <p>{HOME_SUBTITLE}</p>
            <p className="instruction">Click to continue</p>
        </div>
    );
};
