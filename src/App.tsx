import React, { useMemo, useState, useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { useRowContext} from './context';
import { getItem, setItem } from './utils/localStorage';
import { drawFromRanges } from './utils/randomWIthCustomProbability';
import { createAppMachine } from './machines/appMachine';
import { HomeScreen } from './components/screens/HomeScreen';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { BestScoresScreen } from './components/screens/BestScoresScreen';
import {
    WELCOME_MESSAGE1,
    WELCOME_MESSAGE2,
    WELCOME_MESSAGE3,
} from './constants';
import './App.scss';

function App() {
    const { rows } = useRowContext();
    const [bestScores, setBestScores] = useState<number[]>(() => {
        try {
            const item = getItem('bestScores');
            return item || [];
        } catch (error) {
            console.error('Error loading best scores:', error);
            return [];
        }
    });

    const handleUpdateBestScores = useCallback((context: { result: number | null }) => {
        try {
            const updated = [...bestScores, context.result!]
                .sort((a, b) => b - a)
                .slice(0, 5);

            setBestScores(updated);
            setItem('bestScores', updated);
            return { result: null };
        } catch (error) {
            console.error('Error updating best scores:', error);
            return { result: null };
        }
    }, [bestScores]);

    const machineWithActions = useMemo(() => createAppMachine({
        generateResult: () => drawFromRanges(rows),
        resetResult: () => null,
        updateBestScores: handleUpdateBestScores
    }), [rows, handleUpdateBestScores]);

    const [state, send] = useMachine(machineWithActions);

    const handleSpacebarPress = useCallback(() => {
        if (state.matches('home')) {
            send({ type: 'PRESS_SPACE' });
        }
    }, [state, send]);

    React.useEffect(() => {
        const handleMouseClick = (event: MouseEvent) => {
            if (event.button === 0) {
                handleSpacebarPress()
            }
        };
        window.addEventListener('mousedown', handleMouseClick);
        return () => {
            window.removeEventListener('mousedown', handleMouseClick);
        };
    }, [send]);

    const handleVideoEnded = useCallback(() => {
        send({ type: 'VIDEO_ENDED' });
    }, [send]);

    return (
            <div className="app-container" role="application">
                {state.matches('home') && (
                    <HomeScreen/>
                )}
                {state.matches('welcomeMessage1') && (
                    <WelcomeScreen message={WELCOME_MESSAGE1} />
                )}
                {state.matches('welcomeMessage2') && (
                    <WelcomeScreen message={WELCOME_MESSAGE2} />
                )}
                {state.matches('welcomeMessage3') && (
                    <WelcomeScreen message={WELCOME_MESSAGE3} />
                )}
                {state.matches('loading') && (
                    <LoadingScreen onVideoEnded={handleVideoEnded} />
                )}
                {state.matches('result') && state.context.result !== null && (
                    <ResultScreen result={state.context.result} />
                )}
                {state.matches('bestScores') && (
                    <BestScoresScreen scores={bestScores} />
                )}
            </div>
    );
}

export default App;