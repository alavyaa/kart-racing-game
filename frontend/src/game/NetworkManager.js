import { sendPlayerInput, onGameStateUpdate } from '../services/socketService';
import { gameStateService } from '../services/gameStateService';

export class NetworkManager {
  constructor(playerId) {
    this.playerId = playerId;
    this.lastUpdateTime = Date.now();
    this.updateInterval = 1000 / 60; // 60 updates per second
    this.isListening = false;
    this.stateUpdateCallback = null;
  }

  startListening(callback) {
    if (this.isListening) return;

    this.stateUpdateCallback = callback;
    this.isListening = true;

    onGameStateUpdate((gameState) => {
      gameStateService.updateGameState(gameState);
      if (this.stateUpdateCallback) {
        this.stateUpdateCallback(gameState);
      }
    });
  }

  stopListening() {
    this.isListening = false;
  }

  sendInput(inputState) {
    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime >= this.updateInterval) {
      sendPlayerInput(inputState);
      this.lastUpdateTime = currentTime;
    }
  }

  getGameState() {
    return gameStateService;
  }

  destroy() {
    this.stopListening();
  }
}