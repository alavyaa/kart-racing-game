import { v4 as uuidv4 } from 'uuid';
import { GAME_CONSTANTS } from '../config/constants.js';

export class Player {
  constructor(id, username, color, spawnPoint) {
    this.id = id;
    this.username = username;
    this.color = color;
    
    // Position
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    
    // Velocity
    this.velocityX = 0;
    this.velocityY = 0;
    
    // Rotation (in radians)
    this.rotation = 0;
    
    // Input state
    this.inputState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      drift: false,
    };
    
    // Physics
    this.speed = 0;
    this.isAccelerating = false;
    this.isDrifting = false;
    this.driftAngle = 0;
    
    // Game state
    this.isAlive = true;
    this.laps = 0;
    this.position = 0;
    this.lastUpdateTime = Date.now();
  }

  update(deltaTime = 1 / GAME_CONSTANTS.TICK_RATE) {
    if (!this.isAlive) return;

    // Calculate acceleration
    let acceleration = 0;
    if (this.inputState.forward) {
      acceleration = GAME_CONSTANTS.ACCELERATION;
      this.isAccelerating = true;
    } else if (this.inputState.backward) {
      acceleration = -GAME_CONSTANTS.ACCELERATION * 0.6;
      this.isAccelerating = true;
    } else {
      this.isAccelerating = false;
    }

    // Apply drift
    if (this.inputState.drift) {
      this.isDrifting = true;
      this.speed = Math.min(this.speed + acceleration, GAME_CONSTANTS.MAX_SPEED * GAME_CONSTANTS.DRIFT_FACTOR);
    } else {
      this.isDrifting = false;
      this.speed = Math.min(Math.max(this.speed + acceleration, -GAME_CONSTANTS.MAX_SPEED * 0.5), GAME_CONSTANTS.MAX_SPEED);
    }

    // Apply friction
    this.speed *= GAME_CONSTANTS.FRICTION;

    // Handle rotation
    let rotationSpeed = 0;
    if (this.inputState.left) {
      rotationSpeed = GAME_CONSTANTS.ROTATION_SPEED;
    }
    if (this.inputState.right) {
      rotationSpeed = -GAME_CONSTANTS.ROTATION_SPEED;
    }

    // Apply drift boost to rotation
    if (this.isDrifting) {
      rotationSpeed *= 1.2;
    }

    this.rotation += rotationSpeed;

    // Normalize rotation
    if (this.rotation > Math.PI * 2) this.rotation -= Math.PI * 2;
    if (this.rotation < 0) this.rotation += Math.PI * 2;

    // Calculate velocity from rotation and speed
    this.velocityX = Math.cos(this.rotation - Math.PI / 2) * this.speed;
    this.velocityY = Math.sin(this.rotation - Math.PI / 2) * this.speed;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.lastUpdateTime = Date.now();
  }

  setInputState(inputState) {
    this.inputState = { ...this.inputState, ...inputState };
  }

  getState() {
    return {
      id: this.id,
      username: this.username,
      color: this.color,
      x: this.x,
      y: this.y,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      rotation: this.rotation,
      speed: this.speed,
      isAccelerating: this.isAccelerating,
      isDrifting: this.isDrifting,
      laps: this.laps,
      isAlive: this.isAlive,
    };
  }

  reset(spawnPoint) {
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 0;
    this.rotation = 0;
    this.isAlive = true;
  }
}