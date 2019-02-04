import receiver from './receiver-api-v2';

window.cast = {
    receiver,
}

window.OO = {
    STATE: {
        LOADING: 'loading',
        READY: 'ready',
        PAUSED: 'paused',
    },
    VIDEO: {
        MAIN: 'main',
        RELOAD: 'reload',
        ADS: 'ads',
    },
    EVENTS: {
        PLAYBACK_READY: 'playbackReady',
        PLAYING: 'playing',
        PLAYHEAD_TIME_CHANGED: 'playheadTimeChanged',
        PLAYED: 'played',
        SEEK: 'seek',
        SEEKED: 'seeked',
        PAUSED: 'paused',
        ERROR: 'error',
        API_ERROR: 'apiError',
        WILL_PLAY_FROM_BEGINNING: 'willPlayFromBeginning',
    },
    Player: {},
};