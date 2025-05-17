import React from 'react';
import {useActor} from '@xstate/react';
import { FomoMachine} from './machines/appMachine';
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
import { useRowContext } from './context.tsx';

function AppV2() {
    const [snapshot, send] = useActor(FomoMachine);
    const { result, bestScores } = snapshot.context;
    const { value } = snapshot
    const { rows } = useRowContext();

    React.useEffect(() => {
        const handleMouseClick = (event: MouseEvent) => {
            if (event.button === 0) {
                send({ type: 'ADVANCE' });
            }
        };
        window.addEventListener('mousedown', handleMouseClick);
        return () => {
            window.removeEventListener('mousedown', handleMouseClick);
        };
    }, [send]);

    React.useEffect(() => {
        send({ type: 'SET_ROWS', params: { rows } });
    }, [rows, send]);
    
    return (
        <div className="app-container" role="application">
            {value.app == 'home' && (
                <HomeScreen/>
            )}
            {value.app == 'welcomeMessage1' && (
                <WelcomeScreen message={WELCOME_MESSAGE1} />
            )}
            {value.app == 'welcomeMessage2' && (
                <WelcomeScreen message={WELCOME_MESSAGE2} />
            )}
            {value.app  == 'welcomeMessage3' && (
                <WelcomeScreen message={WELCOME_MESSAGE3} />
            )}
            {value.app == 'loading' && (
                <LoadingScreen onVideoEnded={ () => send({ type: 'VIDEO_ENDED' })} />
            )}
            {value.app == 'result' && (
                <ResultScreen result={result} />
            )}
            {value.app == 'bestScores' && (
                <BestScoresScreen scores={bestScores} />
            )}
        </div>
    );
}

export default AppV2;