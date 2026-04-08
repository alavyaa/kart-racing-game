export class GameStateService {
  constructor() {
    this.players = new Map();
    this.gameState = 'waiting';
    this.timestamp = Date.now();
  }

  updateGameState(gameState) {
    this.gameState = gameState.gameState;
    this.timestamp = gameState.timestamp;

    // Update player positions with interpolation
    for (const playerData of gameState.players) {
      const existingPlayer = this.players.get(playerData.id);

      if (existingPlayer) {
        // Store old position for interpolation
        existingPlayer.prevX = existingPlayer.x;
        existingPlayer.prevY = existingPlayer.y;
        existingPlayer.prevRotation = existingPlayer.rotation;
      }

      this.players.set(playerData.id, {
        ...playerData,
        interpolationFactor: 0,
      });
    }
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  clearPlayers() {
    this.players.clear();
  }

  updateInterpolation(factor) {
    for (const player of this.players.values()) {
      player.interpolationFactor = Math.min(factor, 1);
    }
  }

  getGameState() {
    return this.gameState;
  }
}

export const gameStateService = new GameStateService();