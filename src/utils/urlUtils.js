/**
 * Generate a shareable URL for players to join a room
 * @param {string} roomId - Room ID
 * @returns {string} Full URL for players
 */
export function generateRoomUrl(roomId) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/play/${roomId}`;
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
