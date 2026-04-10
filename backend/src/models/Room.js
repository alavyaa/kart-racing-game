import { v4 as uuidv4 } from 'uuid';
import { Player } from './Player.js';
import { GAME_CONSTANTS, PLAYER_COLORS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export class Room {
  constructor(code, hostId, hostUsername) {
    this.code = code;
    this.hostId = hostId;
    this.hostUsername = hostUsername;
    this.players = new Map();
    this.gameState = 'waiting'; // waiting, playing, finished
    this.createdAt = Date.now();
    this.startedAt = null;
    this.colorIndex = 0;
  }

 addPlayer(playerId, username) {
  if (this.players.size >= GAME_CONSTANTS.MAX_PLAYERS_PER_ROOM) {
    return {
      success: false,
      error: 'Room is full',
    };
  }

  if (this.players.has(playerId)) {
    return {
      success: false,
      error: 'Player already in room',
    };
  }

  // 🔥 THIS IS THE MOST IMPORTANT PART (YOU ARE MISSING THIS)
  this.players.set(playerId, {
    id: playerId,
    username,
    ready: false,
  });

  return {
    success: true,
  };
}

    const spawnPoint =
      GAME_CONSTANTS.SPAWN_POINTS[this.players.size % GAME_CONSTANTS.SPAWN_POINTS.length];
    const color = PLAYER_COLORS[this.colorIndex % PLAYER_COLORS.length];
    this.colorIndex++;

    const player = new Player(playerId, username, color, spawnPoint);
    this.players.set(playerId, player);

    logger.info(`Player ${username} added to room ${this.code}`);

    return {
      success: true,
      player: player.getState(),
    };
  }

  removePlayer(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      this.players.delete(playerId);
      logger.info(`Player ${player.username} removed from room ${this.code}`);

      // If room is empty, mark for deletion
      if (this.players.size === 0) {
        return { empty: true };
      }

      // If host left, assign new host
      if (playerId === this.hostId && this.players.size > 0) {
        const newHost = Array.from(this.players.values())[0];
        this.hostId = newHost.id;
        this.hostUsername = newHost.username;
        logger.info(`New host assigned: ${this.hostUsername}`);
        return { hostChanged: true, newHostId: this.hostId };
      }
    }

    return { success: true };
  }

  startGame() {
    if (this.gameState !== 'waiting') {
      return { success: false, error: 'Game already started' };
    }

    this.gameState = 'playing';
    this.startedAt = Date.now();

    logger.info(`Game started in room ${this.code}`);

    return {
      success: true,
      startTime: this.startedAt,
    };
  }

  stopGame() {
    this.gameState = 'waiting';
    this.startedAt = null;

    // Reset all players
    for (const player of this.players.values()) {
      player.reset(GAME_CONSTANTS.SPAWN_POINTS[0]);
    }

    logger.info(`Game stopped in room ${this.code}`);

    return { success: true };
  }

  updatePlayer(playerId, inputState) {
    const player = this.players.get(playerId);
    if (player) {
      player.setInputState(inputState);
      return true;
    }
    return false;
  }

  tick() {
    if (this.gameState !== 'playing') return;

    for (const player of this.players.values()) {
      player.update();
    }
  }

  getState() {
    const players = Array.from(this.players.values()).map((p) => p.getState());

    return {
      code: this.code,
      hostId: this.hostId,
      hostUsername: this.hostUsername,
      players,
      gameState: this.gameState,
      playerCount: this.players.size,
      players: Array.from(this.players.values()), // 🔥 IMPORTANT
      maxPlayers: GAME_CONSTANTS.MAX_PLAYERS_PER_ROOM,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
    };
  }

  getFullState() {
    return {
      ...this.getState(),
      timestamp: Date.now(),
    };
  }
}
