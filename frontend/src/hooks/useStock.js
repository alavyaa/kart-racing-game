import { useEffect, useCallback } from 'react';
import {
  getSocket,
  onRoomUpdated,
  onGameStarted,
  onGameStopped,
  onGameStateUpdate,
  offRoomUpdated,
  offGameStateUpdate,
} from '../services/socketService';

export const useSocket = (callbacks = {}) => {
  const {
    onRoomUpdate,
    onGameStart,
    onGameStop,
    onGameStateUpdate: onStateUpdate,
  } = callbacks;

  useEffect(() => {
    const socket = getSocket();

    const handleRoomUpdate = (room) => {
      if (onRoomUpdate) onRoomUpdate(room);
    };

    const handleGameStart = (data) => {
      if (onGameStart) onGameStart(data);
    };

    const handleGameStop = () => {
      if (onGameStop) onGameStop();
    };

    const handleStateUpdate = (state) => {
      if (onStateUpdate) onStateUpdate(state);
    };

    if (onRoomUpdate) onRoomUpdated(handleRoomUpdate);
    if (onGameStart) onGameStarted(handleGameStart);
    if (onGameStop) onGameStopped(handleGameStop);
    if (onStateUpdate) onGameStateUpdate(handleStateUpdate);

    return () => {
      if (onRoomUpdate) offRoomUpdated(handleRoomUpdate);
      if (onStateUpdate) offGameStateUpdate(handleStateUpdate);
    };
  }, [onRoomUpdate, onGameStart, onGameStop, onStateUpdate]);

  return getSocket();
};