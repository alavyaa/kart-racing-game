import { GAME_CONFIG } from '../utils/constants';

export class Player {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.color = data.color;

    this.x = data.x || 0;
    this.y = data.y || 0;
    this.velocityX = data.velocityX || 0;
    this.velocityY = data.velocityY || 0;
    this.rotation = data.rotation || 0;
    this.speed = data.speed || 0;

    this.isAccelerating = data.isAccelerating || false;
    this.isDrifting = data.isDrifting || false;

    // For interpolation
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevRotation = this.rotation;
    this.interpolationFactor = 0;
  }

  update(data) {
    // Store previous position
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevRotation = this.rotation;

    // Update position
    this.x = data.x;
    this.y = data.y;
    this.velocityX = data.velocityX;
    this.velocityY = data.velocityY;
    this.rotation = data.rotation;
    this.speed = data.speed;

    this.isAccelerating = data.isAccelerating;
    this.isDrifting = data.isDrifting;
  }

  render(ctx) {
    ctx.save();

    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y + GAME_CONFIG.PLAYER_SIZE + 2,
      GAME_CONFIG.PLAYER_SIZE,
      GAME_CONFIG.PLAYER_SIZE / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw kart body
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = this.color;
    ctx.fillRect(-GAME_CONFIG.PLAYER_SIZE / 2, -GAME_CONFIG.PLAYER_SIZE / 2, GAME_CONFIG.PLAYER_SIZE, GAME_CONFIG.PLAYER_SIZE);

    // Draw direction indicator
    ctx.fillStyle = '#fff';
    ctx.fillRect(
      -GAME_CONFIG.PLAYER_SIZE / 4,
      -GAME_CONFIG.PLAYER_SIZE / 2,
      GAME_CONFIG.PLAYER_SIZE / 2,
      GAME_CONFIG.PLAYER_SIZE / 4
    );

    // Draw drift effect
    if (this.isDrifting) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, GAME_CONFIG.PLAYER_SIZE * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw username
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.username, 0, -GAME_CONFIG.PLAYER_SIZE - 5);

    ctx.restore();
  }
}