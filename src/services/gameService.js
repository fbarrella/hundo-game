import { updateRoom } from './roomService';
import { distributeCards, validateCardOrder, getAllCardsInOrder } from '../utils/cardUtils';
import { getThemeFromCard } from '../config/themes';
import { GAME_STATES, GAME_MODES } from '../config/gameConfig';

/**
 * Start a new round - shuffle cards, distribute to players, reveal theme
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Current room data
 * @param {string} gameMode - Game mode (simplified or adventurous)
 * @returns {Promise<void>}
 */
export async function startRound(roomId, roomData, gameMode = GAME_MODES.ADVENTUROUS) {
    try {
        const playerIds = Object.keys(roomData.players);

        if (playerIds.length < 2) {
            throw new Error('Need at least 2 players to start');
        }

        // Determine cards per player based on game mode
        const cardsPerPlayer = gameMode === GAME_MODES.SIMPLIFIED ? 1 : 2;

        // Distribute cards and get theme card
        const { distribution, themeCard } = distributeCards(playerIds, cardsPerPlayer);
        const theme = getThemeFromCard(themeCard);

        // Update each player with their cards and assign sequential positions
        const updatedPlayers = { ...roomData.players };
        let currentPosition = 0;
        Object.entries(distribution).forEach(([playerId, cards]) => {
            updatedPlayers[playerId] = {
                ...updatedPlayers[playerId],
                cards,
                cardPositions: cards.map(() => currentPosition++),
                scaleLabels: cards.map(() => '')
            };
        });

        await updateRoom(roomId, {
            gameState: GAME_STATES.PLAYING,
            gameMode,
            themeCard,
            themeInterval: theme.interval,
            players: updatedPlayers,
            cardOrder: []
        });
    } catch (error) {
        console.error('Error starting round:', error);
        throw error;
    }
}

/**
 * Update a player's card position
 * @param {string} roomId - Room ID
 * @param {string} playerId - Player ID
 * @param {number} cardIndex - Index of the card (0 or 1)
 * @param {number} position - New position in the order
 * @param {Object} roomData - Current room data
 * @returns {Promise<void>}
 */
export async function updateCardPosition(roomId, playerId, cardIndex, position, roomData) {
    try {
        const updatedPlayers = { ...roomData.players };
        const player = updatedPlayers[playerId];

        if (!player) {
            throw new Error('Player not found');
        }

        const oldPosition = player.cardPositions[cardIndex];

        // Find the card currently at the target position
        let displacedPlayerId = null;
        let displacedCardIndex = null;

        for (const [pid, p] of Object.entries(updatedPlayers)) {
            const idx = p.cardPositions?.findIndex(pos => pos === position);
            if (idx !== -1 && !(pid === playerId && idx === cardIndex)) {
                displacedPlayerId = pid;
                displacedCardIndex = idx;
                break;
            }
        }

        // Update the moving card's position
        const newPositions = [...player.cardPositions];
        newPositions[cardIndex] = position;
        updatedPlayers[playerId] = {
            ...player,
            cardPositions: newPositions
        };

        // Swap: move the displaced card to the old position
        if (displacedPlayerId !== null) {
            const displacedPlayer = updatedPlayers[displacedPlayerId];
            const displacedPositions = [...displacedPlayer.cardPositions];
            displacedPositions[displacedCardIndex] = oldPosition;
            updatedPlayers[displacedPlayerId] = {
                ...displacedPlayer,
                cardPositions: displacedPositions
            };
        }

        await updateRoom(roomId, {
            players: updatedPlayers
        });
    } catch (error) {
        console.error('Error updating card position:', error);
        throw error;
    }
}

/**
 * End the round - reveal all cards and validate order
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Current room data
 * @returns {Promise<Object>} Result with isCorrect and cardOrder
 */
export async function endRound(roomId, roomData) {
    try {
        const allCards = getAllCardsInOrder(roomData.players);
        const isCorrect = validateCardOrder(allCards);

        await updateRoom(roomId, {
            gameState: GAME_STATES.ENDED,
            cardOrder: allCards,
            isCorrectOrder: isCorrect
        });

        return {
            isCorrect,
            cardOrder: allCards
        };
    } catch (error) {
        console.error('Error ending round:', error);
        throw error;
    }
}

/**
 * Reset the round for a new game
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Current room data
 * @returns {Promise<void>}
 */
export async function resetRound(roomId, roomData) {
    try {
        // Reset all players' cards and positions
        const updatedPlayers = { ...roomData.players };
        Object.keys(updatedPlayers).forEach(playerId => {
            updatedPlayers[playerId] = {
                ...updatedPlayers[playerId],
                cards: [],
                cardPositions: [],
                scaleLabels: []
            };
        });

        await updateRoom(roomId, {
            gameState: GAME_STATES.WAITING,
            themeCard: null,
            themeInterval: null,
            players: updatedPlayers,
            cardOrder: [],
            isCorrectOrder: null
        });
    } catch (error) {
        console.error('Error resetting round:', error);
        throw error;
    }
}

/**
 * Update a player's scale label for a card
 * @param {string} roomId - Room ID
 * @param {string} playerId - Player ID
 * @param {number} cardIndex - Index of the card (0 or 1)
 * @param {string} label - Scale label text
 * @returns {Promise<void>}
 */
export async function updateScaleLabel(roomId, playerId, cardIndex, label) {
    try {
        // Fetch fresh room data to avoid race conditions with polling
        const { getRoomState } = await import('./roomService');
        const freshRoomData = await getRoomState(roomId);

        const updatedPlayers = { ...freshRoomData.players };
        const player = updatedPlayers[playerId];

        if (!player) {
            throw new Error('Player not found');
        }

        const newLabels = [...(player.scaleLabels || [])];
        newLabels[cardIndex] = label;

        updatedPlayers[playerId] = {
            ...player,
            scaleLabels: newLabels
        };

        await updateRoom(roomId, {
            players: updatedPlayers
        });
    } catch (error) {
        console.error('Error updating scale label:', error);
        throw error;
    }
}

/**
 * End a room - mark it as closed in the database
 * @param {string} roomId - Room ID
 * @returns {Promise<void>}
 */
export async function endRoom(roomId) {
    try {
        await updateRoom(roomId, {
            roomClosed: true,
            closedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error ending room:', error);
        throw error;
    }
}
