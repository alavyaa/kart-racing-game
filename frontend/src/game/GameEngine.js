import { Player } from './Player';
import { Track } from './Track';
import { Camera } from './Camera';
import { gameStateService } from '../services/gameStateService';
import { GAME_CONFIG } from '../utils/constants';
import { calculateDistance } from '../utils/helpers';

export class GameEngine {
  constructor(canvas, ctx, roomData, playerId) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.playerId = playerId;
    this.roomData = roomData;

    // Set canvas size
    this.canvas.width = GAME_CONFIG.WIDTH;
    this.canvas.height = GAME_CONFIG.HEIGHT;

    // Game objects
    this.track = new Track(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    this.camera = new Camera(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    this.players = new Map();

    // Initialize players from room data
    if (roomData && roomData.players) {
      for (const playerData of roomData.players) {
        this.addPlayer(playerData);
      }
    }

    // Game state
    this.isGameRunning = false;
    this.deltaTime = 0;
    this.lastFrameTime = Date.now();
  }

  addPlayer(playerData) {
    if (!this.players.has(playerData.id)) {
      const player = new Player(playerData);
      this.players.set(playerData.id, player);
    }
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  updateGameState(gameState) {
    if (!gameState || !gameState.players) return;

    // Update existing players
    for (const playerData of gameState.players) {
      let player = this.players.get(playerData.id);

      if (!player) {
        this.addPlayer(playerData);
        player = this.players.get(playerData.id);
      }

      // Update player with new data
      if (player) {
        player.update(playerData);
      }
    }

    // Remove players that left
    const activeIds = new Set(gameState.players.map((p) => p.id));
    for (const playerId of this.players.keys()) {
      if (!activeIds.has(playerId)) {
        this.removePlayer(playerId);
      }
    }

    // Update game state
    gameStateService.updateGameState(gameState);
  }

  update(inputState) {
    const currentTime = Date.now();
    this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    // Update camera to follow current player
    const currentPlayer = this.players.get(this.playerId);
    if (currentPlayer) {
      this.camera.follow(currentPlayer.x, currentPlayer.y);
    }

    // Check collisions between players
    const playersArray = Array.from(this.players.values());
    for (let i = 0; i < playersArray.length; i++) {
      for (let j = i + 1; j < playersArray.length; j++) {
        const p1 = playersArray[i];
        const p2 = playersArray[j];
        const distance = calculateDistance(p1.x, p1.y, p2.x, p2.y);

        if (distance < GAME_CONFIG.PLAYER_SIZE * 2) {
          this.handlePlayerCollision(p1, p2);
        }
      }
    }
  }

  handlePlayerCollision(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    // Simple collision response
    const nx = dx / distance;
    const ny = dy / distance;

    p1.x -= nx * 5;
    p1.y -= ny * 5;
    p2.x += nx * 5;
    p2.y += ny * 5;
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = '#0a0e27';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Save context state for camera transformation
    this.ctx.save();

    // Apply camera transformation
    this.ctx.translate(
      this.canvas.width / 2 - this.camera.x,
      this.canvas.height / 2 - this.camera.y
    );

    // Draw track
    this.track.render(this.ctx);

    // Draw players
    for (const player of this.players.values()) {
      player.render(this.ctx);
    }

    // Restore context state
    this.ctx.restore();

    // Draw UI
    this.drawUI();
  }

  drawUI() {
    const currentPlayer = this.players.get(this.playerId);

    if (currentPlayer) {
      // Draw player name and speed
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '14px Arial';
      this.ctx.fillText(`Speed: ${currentPlayer.speed.toFixed(2)}`, 10, 20);
      this.ctx.fillText(`Position: ${currentPlayer.x.toFixed(0)}, ${currentPlayer.y.toFixed(0)}`, 10, 40);
    }

    // Draw player list
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('Players:', 10, 70);

    let yOffset = 90;
    for (const player of this.players.values()) {
      this.ctx.fillStyle = player.color;
      this.ctx.fillText(`● ${player.username}`, 10, yOffset);
      yOffset += 20;
    }
  }

  destroy() {
    this.players.clear();
  }
}