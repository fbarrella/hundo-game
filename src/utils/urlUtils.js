/**
 * Generate a shareable URL for players to join a room
 * @param {string} roomId - Room ID
 * @returns {string} Full URL for players
 */
export function generateRoomUrl(roomId) {
    // Get the current full URL
    const currentUrl = window.location.href;

    // If we are in the moderator view, replace it with play view
    if (currentUrl.includes('/moderator/')) {
        return currentUrl.replace('/moderator/', '/play/');
    }

    // Fallback: construct from origin + pathname base if possible, 
    // or just use origin if we can't determine better.
    // Ideally we want to keep the base path.
    const baseUrl = window.location.origin + window.location.pathname;

    // If we're at root, just append
    if (baseUrl.endsWith('/')) {
        return `${baseUrl}play/${roomId}`;
    }

    // If we are at a specific path like /hundo-game/
    // We try to find where the app root is. 
    // But simplest is assuming the user is on a valid page of the app.
    // If they are on home '/', valid.

    return `${window.location.origin}/play/${roomId}`;
}

/**
 * Extract room ID from current URL
 * @returns {string|null} Room ID or null if not found
 */
export function extractRoomIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    const playIndex = pathParts.indexOf('play');
    const moderatorIndex = pathParts.indexOf('moderator');

    if (playIndex !== -1 && pathParts[playIndex + 1]) {
        return pathParts[playIndex + 1];
    }

    if (moderatorIndex !== -1 && pathParts[moderatorIndex + 1]) {
        return pathParts[moderatorIndex + 1];
    }

    return null;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
}
