// Game configuration constants

export const GAME_CONFIG = {
    TOTAL_CARDS: 100,
    CARDS_PER_PLAYER: 2,
    POLLING_INTERVAL: 5000, // 5 seconds
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 10,
    THEME_COUNT: 20,
    CARDS_PER_THEME: 5
};

export const GAME_STATES = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    ENDED: 'ended',
    REVEALING: 'revealing'
};

export const PLAYER_STATES = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    READY: 'ready'
};
