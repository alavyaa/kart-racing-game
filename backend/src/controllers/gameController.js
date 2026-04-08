import { gameState } from '../models/GameState.js';
import { logger } from '../utils/logger.js';

export const startGame = async (roomCode, hostId) => {
  try {
    const room = gameState.getRoom(roomCode);
    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    if (room.hostId !== hostId) {
      return {
        success: false,
        error: 'Only host can start game',
      };
    }

    const result = gameState.startGame(roomCode);
    logger.info(`Game started in room ${roomCode} by ${room.hostUsername}`);

    return result;
  } catch (error) {
    logger.error('Error starting game:', error);
    return {
      success: false,
      error: 'Failed to start game',
    };
  }
};

export const stopGame = async (roomCode, hostId) => {
  try {
    const room = gameState.getRoom(roomCode);
    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    if (room.hostId !== hostId) {
      return {
        success: false,
        error: 'Only host can stop game',
      };
    }

    const result = gameState.stopGame(roomCode);
    logger.info(`Game stopped in room ${roomCode}`);

    return result;
  } catch (error) {
    logger.error('Error stopping game:', error);
    return {
      success: false,
      error: 'Failed to stop game',
    };
  }
};

export const updatePlayerInput = async (roomCode, playerId, inputState) => {
  try {
    const success = gameState.updatePlayerInput(roomCode, playerId, inputState);
    return { success };
  } catch (error) {
    logger.error('Error updating player input:', error);
    return {
      success: false,
      error: 'Failed to update input',
    };
  }
};

export const getGameState = async (roomCode) => {
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
      gameState: room.getFullState(),
    };
  } catch (error) {
    logger.error('Error getting game state:', error);
    return {
      success: false,
      error: 'Failed to get game state',
    };
  }
};

export const getPlayerStats = async (roomCode, playerId) => {
  try {
    const room = gameState.getRoom(roomCode);
    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    const player = room.players.get(playerId);
    if (!player) {
      return {
        success: false,
        error: 'Player not found',
      };
    }

    return {
      success: true,
      stats: {
        username: player.username,
        laps: player.laps,
        position: player.position,
        speed: player.speed,
        isAlive: player.isAlive,
      },
    };
  } catch (error) {
    logger.error('Error getting player stats:', error);
    return {
      success: false,
      error: 'Failed to get player stats',
    };
  }
};