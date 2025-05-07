import { createMachine, assign } from 'xstate';
import { useHotkeys } from "react-hotkeys-hook";
import {useRef, useState} from "react";
import "./App.scss";
import {drawFromRanges} from "./utils/randomWIthCustomProbability.ts";
import {useMachine} from "@xstate/react";
import {useRowContext} from "./context.tsx";
import {getItem, setItem} from "./utils/localStorage.ts";

//delays
const LONG_WELCOME_MESSAGE_TIME = 10 * 1000;
const SHORT_WELCOME_MESSAGE_TIME = 5 * 1000;
const POST_LOADING_DELAY = 10 * 1000;
const POST_BEST_SCORE_DELAY = 15 * 1000;

//messages
const WELCOME_MESSAGE1 = "xPress is a new, high-tech system that calculates the total of human worth.";
const WELCOME_MESSAGE2 = "Please stay still.";
const WELCOME_MESSAGE3 = "The scanning will begin.";

const HOME_TITLE = "Welcome to xPress";
const HOME_SUBTITLE = "Press to start";


// Define the state machine
const appMachine = createMachine({
    id: 'xpress-app',
    initial: 'home',
    context: {
        result: null as number | null
    },
    states: {
        home: {
            on: {
                PRESS_SPACE: 'welcomeMessage1'
            }
        },
        welcomeMessage1: {
            after: {
                [LONG_WELCOME_MESSAGE_TIME]: {
                    target: 'welcomeMessage2',
                }
            }
        },
        welcomeMessage2: {
            after: {
                [SHORT_WELCOME_MESSAGE_TIME]: {
                    target: 'welcomeMessage3',
                }
            }
        },
        welcomeMessage3: {
            after: {
                [SHORT_WELCOME_MESSAGE_TIME]: {
                    target: 'loading',
                }
            }
        },
        loading: {
            on: {
                VIDEO_ENDED: {
                    target: 'result',
                    actions: 'generateResult'
                }
            }
        },
        result: {
            after: {
                [POST_LOADING_DELAY]: {
                    target: 'bestScores',
                    actions: 'updateBestScores'
                }
            }
        },
        bestScores: {
            after: {
                [POST_BEST_SCORE_DELAY]: {
                    target: 'home',
                    actions: 'resetResult'
                }
            }
        }
    }
});

function App() {
    const { rows } = useRowContext();
    const [bestScores, setBestScores] = useState<number[] | []>(() => {
        const item = getItem('bestScores');
        return item || [];
    });


    const machineWithActions = appMachine.provide({
        actions: {
            generateResult: assign({
                result: () => drawFromRanges(rows)
            }),
            resetResult: assign({
                result: () => null
            }),
            updateBestScores: assign(({ context }) => {
                const updated = [...bestScores, context.result!]
                    .sort((a, b) => b - a)
                    .slice(0, 5);

                setBestScores(updated);
                setItem('bestScores', updated);
                return { result: null };
            })
        }
    });

    const [state, send] = useMachine(machineWithActions);

    const videoRef = useRef(null);

    const handleSpacebarPress = () => {
        if (state.matches('home')) {
            send({ type: "PRESS_SPACE" }) ;
        }
    };

    const handleVideoEnded = () => {
        send({ type: "VIDEO_ENDED" });
    };

    useHotkeys('space', handleSpacebarPress, { enableOnFormTags: ['input', 'select', 'textarea'] });

    return (
        <div className="app-container">
            {state.matches('home') && (
                <div className="home-screen">
                    <h1>{HOME_TITLE}</h1>
                    <p>{HOME_SUBTITLE}</p>
                </div>
            )}
            {state.matches('welcomeMessage1') && (
                <div className="welcome-message">
                    <p>{WELCOME_MESSAGE1}</p>
                </div>
            )}
            {state.matches('welcomeMessage2') && (
                <div className="welcome-message">
                    <p>{WELCOME_MESSAGE2}</p>
                </div>
            )}
            {state.matches('welcomeMessage3') && (
                <div className="welcome-message">
                    <p>{WELCOME_MESSAGE3}</p>
                </div>
            )}
            {state.matches('loading') && (
                <div className="loading-screen">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        onEnded={handleVideoEnded}
                        className="loading-video"
                    >
                        <source src="/loading_screen_nobackground_21-ezgif.com-gif-to-webm-converter.webm" type="video/webm" />
                        Your browser does not support videos.
                    </video>
                </div>
            )}

            {state.matches('result') && (
                <div className="result-screen">
                    <h1> Your score is </h1>
                    <h2 className="result-number">{state.context.result}</h2>
                </div>
            )}

            {state.matches('bestScores') && (
                <div className="best-scores">
                    <h1>BEST SCORES</h1>
                    <ol className="best-scores-list" >
                        {bestScores && bestScores.map((score) => (<li>{score}</li>))}
                    </ol>
                </div>
            )}
        </div>
    );
}

export default App;