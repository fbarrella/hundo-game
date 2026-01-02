import { useState, useEffect, useRef } from 'react';
import { getRoomState } from './roomService';
import { GAME_CONFIG } from '../config/gameConfig';

/**
 * Custom hook for polling room state
 * @param {string} roomId - Room ID to poll
 * @returns {Object} { roomData, loading, error, refetch }
 */
export function useRoomPolling(roomId) {
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const isMountedRef = useRef(true);

    const fetchRoomData = async () => {
        if (!roomId) return;

        try {
            const data = await getRoomState(roomId);
            if (isMountedRef.current) {
                // Check if room has been closed
                if (data.roomClosed) {
                    setError('Room has been closed by the moderator');
                    setLoading(false);
                    return;
                }

                setRoomData(data);
                setError(null);
                setLoading(false);
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError(err.message);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        isMountedRef.current = true;

        // Initial fetch
        fetchRoomData();

        // Set up polling
        intervalRef.current = setInterval(() => {
            fetchRoomData();
        }, GAME_CONFIG.POLLING_INTERVAL);

        // Cleanup
        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [roomId]);

    return {
        roomData,
        loading,
        error,
        refetch: fetchRoomData
    };
}
