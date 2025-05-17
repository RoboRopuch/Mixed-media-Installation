import {assign, createMachine, enqueueActions, setup} from 'xstate';
import {AppContext, AppStateValue} from '../types/machine';
import {
    BEST_SCORES_KEY,
    LONG_WELCOME_MESSAGE_TIME,
    NUMBER_OF_BEST_SCORES,
    POST_BEST_SCORE_DELAY,
    POST_LOADING_DELAY, PROBABILITY_RANGES_KEY,
    SHORT_WELCOME_MESSAGE_TIME
} from '../constants';
import {drawFromRanges} from "../utils/randomWIthCustomProbability.ts";
import {Row} from "../context.tsx";
import {getItem, setItem} from "../utils/localStorage.ts";

type AppMachineActions = {
    generateResult: () => number;
    resetResult: () => null;
    updateBestScores: (context: AppContext) => { result: number | null };
};

export type FomoMachineEvents =
    | { type: 'SET_ROWS'; params: { rows: Row[] } }
    | { type: 'ADVANCE' }
    | { type: 'VIDEO_ENDED' }
    | { type: 'UPDATE_ROW' };

export const FomoMachine = setup({
    types: {
        context: {
            rows: [] as Row[],
            result: 0 as number,
            bestScores: [] as number[],
        },
        events: {} as FomoMachineEvents, // Use the new event type
    },
    actions: {
        setRows: enqueueActions(({ event, enqueue }) => {
            if (event.type === 'SET_ROWS') {
                enqueue.assign({ rows: event.params.rows });
            }
        }),
        loadRows: enqueueActions(({ enqueue }) => {
            const local = getItem(PROBABILITY_RANGES_KEY);
            const bestScores = getItem(BEST_SCORES_KEY);
            console.log("FOMO", local);
            enqueue.assign({
                rows: local ?? [],
                bestScores: bestScores ?? [],
            });
        }),

        calculateNewResult: enqueueActions(({ context, enqueue }) => {
            console.log('calculateNewResult', context);

            if (!context.rows || context.rows.length === 0) {
                console.warn("Cannot generate result: context.rows is missing or empty.");
                enqueue.assign({ result: 0 });
                return;
            }

            console.log("FOMO", context.rows);
            const result = drawFromRanges(context.rows);
            enqueue.assign({ result });
        }),

        updateBestScores: enqueueActions(({ context, enqueue }) => {
            const bestScores = context.bestScores;
            const newScore = context.result;
            const updated =  [...bestScores, newScore]
                .sort((a, b) => b - a)
                .slice(0, NUMBER_OF_BEST_SCORES);
            setItem('bestScores', updated);
            enqueue.assign({ bestScores: updated })
        }),
    },
    delays: {
        LONG_WELCOME_MESSAGE_TIME,
        SHORT_WELCOME_MESSAGE_TIME,
        POST_LOADING_DELAY,
        POST_BEST_SCORE_DELAY,
    },
}).createMachine({
    context: {
        rows: [],
        result: 0,
        bestScores: []
    },
    type: 'parallel',
    states: {
        app: {
            initial: 'home',
            states: {
                home: {
                    on: {
                        ADVANCE: 'welcomeMessage1'
                    }
                },
                welcomeMessage1: {
                    after: {
                        LONG_WELCOME_MESSAGE_TIME: {
                            target: 'welcomeMessage2',
                        }
                    },
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
                        SHORT_WELCOME_MESSAGE_TIME: {
                            target: 'loading',
                        }
                    }
                },
                loading: {
                    entry: [{ type: 'loadRows' }],
                    on: {
                        VIDEO_ENDED:'result'
                    }
                },
                result: {
                    entry: [{ type: 'calculateNewResult' }],
                    after: {
                        POST_LOADING_DELAY: {
                            target: 'bestScores',
                        }
                    }
                },
                bestScores: {
                    entry: [{ type: 'updateBestScores' }],
                    after: {
                        POST_BEST_SCORE_DELAY: {
                            target: 'home',
                        }
                    }
                },
            }
        },
        ready: {
            on: {
                SET_ROWS: {
                    actions: ['setRows']
                },
            },
        },
    }
});

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
                entry: assign({ result: () => actions.generateResult() }),
                after: {
                    [POST_LOADING_DELAY]: {
                        target: 'bestScores',
                    }
                }
            },
            bestScores: {
                entry: ({ context: machineContext }) => actions.updateBestScores(machineContext),
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