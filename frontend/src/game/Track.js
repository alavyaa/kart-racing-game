import { GAME_CONFIG } from '../utils/constants';

export class Track {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.obstacles = this.generateObstacles();
  }

  generateObstacles() {
    const obstacles = [];

    // Create a simple oval track with obstacles
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radiusX = 300;
    const radiusY = 200;

    // Add some obstacles in the middle
    for (let i = 0; i < 5; i++) {
      obstacles.push({
        x: centerX + (Math.random() - 0.5) * radiusX,
        y: centerY + (Math.random() - 0.5) * radiusY,
        width: 40,
        height: 40,
        type: 'box',
      });
    }

    return obstacles;
  }

  render(ctx) {
    // Draw grass background
    ctx.fillStyle = '#2a5a3a';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw track
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.ellipse(
      this.width / 2,
      this.height / 2,
      350,
      220,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw track inner area (grass)
    ctx.fillStyle = '#2a5a3a';
    ctx.beginPath();
    ctx.ellipse(
      this.width / 2,
      this.height / 2,
      300,
      180,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw obstacles
    for (const obstacle of this.obstacles) {
      ctx.fillStyle = '#8a7a5a';
      ctx.fillRect(obstacle.x - obstacle.width / 2, obstacle.y - obstacle.height / 2, obstacle.width, obstacle.height);

      // Draw obstacle border
      ctx.strokeStyle = '#6a5a3a';
      ctx.lineWidth = 2;
      ctx.strokeRect(obstacle.x - obstacle.width / 2, obstacle.y - obstacle.height / 2, obstacle.width, obstacle.height);
    }

    // Draw start/finish line
    const lineX = this.width / 2;
    const lineY = this.height / 2 + 180;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(lineX - 50, lineY);
    ctx.lineTo(lineX + 50, lineY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}