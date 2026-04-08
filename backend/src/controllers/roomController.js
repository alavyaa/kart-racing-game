import { gameState } from '../models/GameState.js';
import { validateUsername, validateRoomCode } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

export const createRoom = async (hostId, username) => {
  try {
    const validation = validateUsername(username);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generate unique room code
    let roomCode = generateRoomCode();
    while (gameState.rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const result = gameState.createRoom(roomCode, hostId, username);
    return result;
  } catch (error) {
    logger.error('Error creating room:', error);
    return {
      success: false,
      error: 'Failed to create room',
    };
  }
};

export const joinRoom = async (roomCode, playerId, username) => {
  try {
    const validation = validateUsername(username);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const codeValidation = validateRoomCode(roomCode);
    if (!codeValidation.valid) {
      return {
        success: false,
        error: codeValidation.error,
      };
    }

    const result = gameState.joinRoom(codeValidation.code, playerId, username);
    return result;
  } catch (error) {
    logger.error('Error joining room:', error);
    return {
      success: false,
      error: 'Failed to join room',
    };
  }
};

export const leaveRoom = async (roomCode, playerId) => {
  try {
    const result = gameState.leaveRoom(roomCode, playerId);
    return result;
  } catch (error) {
    logger.error('Error leaving room:', error);
    return {
      success: false,
      error: 'Failed to leave room',
    };
  }
};

export const getRoomState = async (roomCode) => {
  try {
    const room = gameState.getRoom(roomCode);
    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    return {
      success: true,
      room: room.getState(),
    };
  } catch (error) {
    logger.error('Error getting room state:', error);
    return {
      success: false,
      error: 'Failed to get room state',
    };
  }
};

export const listPublicRooms = async () => {
  try {
    const rooms = gameState.getAllPublicRooms();
    return {
      success: true,
      rooms,
    };
  } catch (error) {
    logger.error('Error listing rooms:', error);
    return {
      success: false,
      error: 'Failed to list rooms',
    };
  }
};

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}