import { Room } from './Room.js';
import { logger } from '../utils/logger.js';

export class GameState {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(code, hostId, hostUsername) {
    if (this.rooms.has(code)) {
      return {
        success: false,
        error: 'Room already exists',
      };
    }

    const room = new Room(code, hostId, hostUsername);
    this.rooms.set(code, room);

    logger.info(`Room created: ${code} by ${hostUsername}`);

    return {
      success: true,
      room: room.getState(),
    };
  }

  joinRoom(code, playerId, username) {
    const room = this.rooms.get(code);
    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    const result = room.addPlayer(playerId, username);
    if (result.success) {
      return {
        success: true,
        room: room.getState(),
      };
    }

    return result;
  }

  leaveRoom(code, playerId) {
    const room = this.rooms.get(code);
    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    const result = room.removePlayer(playerId);

    if (result.empty) {
      this.rooms.delete(code);
      logger.info(`Room deleted: ${code} (empty)`);
    }

    return {
      success: true,
      room: room.getState ? room.getState() : null,
      ...result,
    };
  }

  getRoom(code) {
    return this.rooms.get(code);
  }

  getRoomByPlayerId(playerId) {
    for (const room of this.rooms.values()) {
      if (room.players.has(playerId)) {
        return room;
      }
    }
    return null;
  }

  startGame(code) {
    const room = this.rooms.get(code);
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    return room.startGame();
  }

  stopGame(code) {
    const room = this.rooms.get(code);
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    return room.stopGame();
  }

  updatePlayerInput(code, playerId, inputState) {
    const room = this.rooms.get(code);
    if (!room) {
      return false;
    }

    return room.updatePlayer(playerId, inputState);
  }

  getAllPublicRooms() {
    return Array.from(this.rooms.values())
      .filter((room) => room.gameState === 'waiting')
      .map((room) => ({
        code: room.code,
        hostUsername: room.hostUsername,
        playerCount: room.players.size,
        maxPlayers: room.maxPlayers,
      }));
  }

  tick() {
    for (const room of this.rooms.values()) {
      room.tick();
    }
  }
}

// Singleton instance
export const gameState = new GameState();