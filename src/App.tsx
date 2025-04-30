import { createMachine, assign } from 'xstate';
import { useHotkeys } from "react-hotkeys-hook";
import { useRef } from "react";
import "./App.scss";
import {drawFromRanges} from "./utils/randomWIthCustomProbability.ts";
import {useMachine} from "@xstate/react";
import {useRowContext} from "./context.tsx";

//delays
const POST_BUTTON_PRESS_DELAY = 10 * 1000;
const POST_LOADING_DELAY = 10 * 1000;
const POST_BEST_SCORE_DELAY = 15 * 1000;

//messages
const WELCOME_MESSAGE = "xPress is a new, high-tech system that calculates the total of human worth. Please stay still. The scanning will begin.";
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
                PRESS_SPACE: 'welcomeMessage'
            }
        },
        welcomeMessage: {
            after: {
                [POST_BUTTON_PRESS_DELAY]: {
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
                    actions: 'resetResult'
                }
            }
        },
        bestScores: {
            after: {
                [POST_BEST_SCORE_DELAY]: {
                    target: 'home',
                }
            }
        }
    }
});

function App() {
    const { rows } = useRowContext();

    const machineWithActions = appMachine.provide({
        actions: {
            generateResult: assign({
                result: () => drawFromRanges(rows)
            }),
            resetResult: assign({
                result: () => null
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
            {state.matches('welcomeMessage') && (
                <div className="welcome-message">
                    <p>{WELCOME_MESSAGE}</p>
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
                    <h2 className="result-number">{state.context.result}</h2>
                </div>
            )}

            {state.matches('bestScores') && (
                <div className="best-scores">
                    <h1>BEST SCORES</h1>
                    <ol className="best-scores-list" >
                        <li>1234</li>
                        <li>23</li>
                        <li>1</li>
                    </ol>
                </div>
            )}
        </div>
    );
}

export default App;