import { db } from './firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { GAME_STATES } from '../config/gameConfig';

/**
 * Create a new game room
 * @returns {Promise<string>} Room ID
 */
export async function createRoom() {
    const roomId = uuidv4().substring(0, 8).toUpperCase();

    const roomData = {
        roomId,
        createdAt: serverTimestamp(),
        gameState: GAME_STATES.WAITING,
        themeCard: null,
        themeInterval: null,
        players: {},
        cardOrder: [],
        moderatorPlayerId: null,
        kickedPlayers: []
    };

    try {
        await setDoc(doc(db, 'rooms', roomId), roomData);
        return roomId;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
}

/**
 * Join a room as a player
 * @param {string} roomId - Room ID to join
 * @param {string} playerName - Player's name
 * @returns {Promise<string>} Player ID
 */
export async function joinRoom(roomId, playerName) {
    const playerId = uuidv4();

    try {
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            throw new Error('Room not found');
        }

        const roomData = roomSnap.data();

        // Check if player is blacklisted
        if (roomData.kickedPlayers?.includes(playerId)) {
            throw new Error('You have been removed from this room');
        }
        const updatedPlayers = {
            ...roomData.players,
            [playerId]: {
                name: playerName,
                cards: [],
                cardPositions: [],
                joinedAt: new Date().toISOString()
            }
        };

        await updateDoc(roomRef, {
            players: updatedPlayers
        });

        return playerId;
    } catch (error) {
        console.error('Error joining room:', error);
        throw error;
    }
}

/**
 * Join a room as the moderator (also as a player)
 * @param {string} roomId - Room ID to join
 * @param {string} playerName - Moderator's player name
 * @returns {Promise<string>} Player ID
 */
export async function joinRoomAsModerator(roomId, playerName) {
    const playerId = uuidv4();

    try {
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            throw new Error('Room not found');
        }

        const roomData = roomSnap.data();

        // Check if player is blacklisted
        if (roomData.kickedPlayers?.includes(playerId)) {
            throw new Error('You have been removed from this room');
        }

        const updatedPlayers = {
            ...roomData.players,
            [playerId]: {
                name: playerName,
                cards: [],
                cardPositions: [],
                joinedAt: new Date().toISOString()
            }
        };

        await updateDoc(roomRef, {
            players: updatedPlayers,
            moderatorPlayerId: playerId
        });

        return playerId;
    } catch (error) {
        console.error('Error joining room as moderator:', error);
        throw error;
    }
}

/**
 * Remove moderator from players
 * @param {string} roomId - Room ID
 * @param {string} playerId - Moderator's player ID
 * @returns {Promise<void>}
 */
export async function leaveRoomAsModerator(roomId, playerId) {
    try {
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            throw new Error('Room not found');
        }

        const roomData = roomSnap.data();
        const updatedPlayers = { ...roomData.players };
        delete updatedPlayers[playerId];

        await updateDoc(roomRef, {
            players: updatedPlayers,
            moderatorPlayerId: null
        });
    } catch (error) {
        console.error('Error leaving room as moderator:', error);
        throw error;
    }
}

/**
 * Get current room state
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Room data
 */
export async function getRoomState(roomId) {
    try {
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            throw new Error('Room not found');
        }

        return roomSnap.data();
    } catch (error) {
        console.error('Error getting room state:', error);
        throw error;
    }
}

/**
 * Delete a room
 * @param {string} roomId - Room ID to delete
 * @returns {Promise<void>}
 */
export async function deleteRoom(roomId) {
    try {
        await deleteDoc(doc(db, 'rooms', roomId));
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error;
    }
}

/**
 * Kick a player from the room and add to blacklist
 * @param {string} roomId - Room ID
 * @param {string} playerId - Player ID to kick
 * @returns {Promise<void>}
 */
export async function kickPlayer(roomId, playerId) {
    try {
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            throw new Error('Room not found');
        }

        const roomData = roomSnap.data();
        const updatedPlayers = { ...roomData.players };
        delete updatedPlayers[playerId];

        const kickedPlayers = roomData.kickedPlayers || [];
        if (!kickedPlayers.includes(playerId)) {
            kickedPlayers.push(playerId);
        }

        await updateDoc(roomRef, {
            players: updatedPlayers,
            kickedPlayers: kickedPlayers
        });
    } catch (error) {
        console.error('Error kicking player:', error);
        throw error;
    }
}

/**
 * Update room data
 * @param {string} roomId - Room ID
 * @param {Object} updates - Data to update
 * @returns {Promise<void>}
 */
export async function updateRoom(roomId, updates) {
    try {
        const roomRef = doc(db, 'rooms', roomId);
        await updateDoc(roomRef, updates);
    } catch (error) {
        console.error('Error updating room:', error);
        throw error;
    }
}
