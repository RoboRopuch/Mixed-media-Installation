export type AppContext = {
    result: number | null;
};

export type AppEvent =
    | { type: 'PRESS_SPACE' }
    | { type: 'VIDEO_ENDED' };

export type AppStateValue =
    | 'home'
    | 'welcomeMessage1'
    | 'welcomeMessage2'
    | 'welcomeMessage3'
    | 'loading'
    | 'result'
    | 'bestScores';

export type AppState = {
    value: AppStateValue;
    context: AppContext;
}; 