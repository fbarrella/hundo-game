import { GAME_CONFIG } from '../config/gameConfig';

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Create a deck of cards numbered 1-100
 * @returns {number[]} Array of card numbers
 */
export function createDeck() {
    return Array.from({ length: GAME_CONFIG.TOTAL_CARDS }, (_, i) => i + 1);
}

/**
 * Shuffle and distribute cards to players
 * @param {Array} playerIds - Array of player IDs
 * @param {number} cardsPerPlayer - Number of cards to distribute per player (defaults to 2)
 * @returns {Object} Object mapping player IDs to their cards
 */
export function distributeCards(playerIds, cardsPerPlayer = GAME_CONFIG.CARDS_PER_PLAYER) {
    const deck = shuffleArray(createDeck());
    const distribution = {};

    playerIds.forEach((playerId, index) => {
        const startIndex = index * cardsPerPlayer;
        distribution[playerId] = deck.slice(startIndex, startIndex + cardsPerPlayer);
    });

    return {
        distribution,
        themeCard: deck[playerIds.length * cardsPerPlayer]
    };
}

/**
 * Validate if cards are in ascending order
 * @param {Array} cards - Array of card objects with {cardNumber, position}
 * @returns {boolean} True if cards are in correct order
 */
export function validateCardOrder(cards) {
    // Sort by position
    const sortedByPosition = [...cards].sort((a, b) => a.position - b.position);

    // Check if card numbers are in ascending order
    for (let i = 1; i < sortedByPosition.length; i++) {
        if (sortedByPosition[i].cardNumber <= sortedByPosition[i - 1].cardNumber) {
            return false;
        }
    }

    return true;
}

/**
 * Get all cards from players in order
 * @param {Object} players - Players object from game state
 * @returns {Array} Array of card objects sorted by position
 */
export function getAllCardsInOrder(players) {
    const allCards = [];

    Object.entries(players).forEach(([playerId, player]) => {
        player.cards.forEach((cardNumber, cardIndex) => {
            allCards.push({
                playerId,
                playerName: player.name,
                cardNumber,
                cardIndex,
                position: player.cardPositions?.[cardIndex] ?? 999, // Default to end if not positioned
                scaleLabel: player.scaleLabels?.[cardIndex] ?? ''
            });
        });
    });

    return allCards.sort((a, b) => a.position - b.position);
}
