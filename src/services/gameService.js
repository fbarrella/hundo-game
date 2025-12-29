import { updateRoom } from './roomService';
import { distributeCards, validateCardOrder, getAllCardsInOrder } from '../utils/cardUtils';
import { getThemeFromCard } from '../config/themes';
import { GAME_STATES } from '../config/gameConfig';

/**
 * Start a new round - shuffle cards, distribute to players, reveal theme
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Current room data
 * @returns {Promise<void>}
 */
export async function startRound(roomId, roomData) {
    try {
        const playerIds = Object.keys(roomData.players);

        if (playerIds.length < 2) {
            throw new Error('Need at least 2 players to start');
        }

        // Distribute cards and get theme card
        const { distribution, themeCard } = distributeCards(playerIds);
        const theme = getThemeFromCard(themeCard);

        // Update each player with their cards
        const updatedPlayers = { ...roomData.players };
        Object.entries(distribution).forEach(([playerId, cards]) => {
            updatedPlayers[playerId] = {
                ...updatedPlayers[playerId],
                cards,
                cardPositions: [999, 999] // Default positions (not placed yet)
            };
        });

        await updateRoom(roomId, {
            gameState: GAME_STATES.PLAYING,
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

        // Update the card position
        const newPositions = [...player.cardPositions];
        newPositions[cardIndex] = position;

        updatedPlayers[playerId] = {
            ...player,
            cardPositions: newPositions
        };

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
                cardPositions: []
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
