import { createMachine, assign } from 'xstate';
import { AppContext, AppStateValue } from '../types/machine';
import {
    LONG_WELCOME_MESSAGE_TIME,
    POST_BEST_SCORE_DELAY,
    POST_LOADING_DELAY,
    SHORT_WELCOME_MESSAGE_TIME,
} from '../constants';

type AppMachineActions = {
    generateResult: () => number;
    resetResult: () => null;
    updateBestScores: (context: AppContext) => AppContext;
};

export const createAppMachine = (actions: AppMachineActions) => {
    return createMachine({
        id: 'xpress-app',
        initial: 'home' as AppStateValue,
        context: {
            result: null
        } as AppContext,
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
                        actions: assign({
                            result: () => actions.generateResult()
                        })
                    }
                }
            },
            result: {
                after: {
                    [POST_LOADING_DELAY]: {
                        target: 'bestScores',
                        actions: assign((context) => ({
                            result: actions.updateBestScores(context).result
                        }))
                    }
                }
            },
            bestScores: {
                after: {
                    [POST_BEST_SCORE_DELAY]: {
                        target: 'home',
                        actions: assign({
                            result: () => actions.resetResult()
                        })
                    }
                }
            }
        }
    });
}; 