import { GAME_CONFIG } from '../utils/constants';

export class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.x = 0;
    this.y = 0;
    this.smoothness = 0.1; // Camera smoothing factor
  }

  follow(targetX, targetY) {
    // Smooth camera movement
    this.x += (targetX - this.x) * this.smoothness;
    this.y += (targetY - this.y) * this.smoothness;

    // Clamp camera to world bounds
    const minX = this.viewportWidth / 2;
    const maxX = GAME_CONFIG.WIDTH - this.viewportWidth / 2;
    const minY = this.viewportHeight / 2;
    const maxY = GAME_CONFIG.HEIGHT - this.viewportHeight / 2;

    this.x = Math.max(minX, Math.min(maxX, this.x));
    this.y = Math.max(minY, Math.min(maxY, this.y));
  }

  getOffsetX() {
    return this.x - this.viewportWidth / 2;
  }

  getOffsetY() {
    return this.y - this.viewportHeight / 2;
  }
}