import { GAME_CONSTANTS } from '../config/constants.js';

export const checkPlayerCollision = (player1, player2) => {
  const dx = player2.x - player1.x;
  const dy = player2.y - player1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < GAME_CONSTANTS.PLAYER_SIZE * 2;
};

export const handlePlayerCollision = (player1, player2) => {
  const dx = player2.x - player1.x;
  const dy = player2.y - player1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return; // Avoid division by zero

  // Normalize collision vector
  const nx = dx / distance;
  const ny = dy / distance;

  // Separate players
  const overlap = GAME_CONSTANTS.PLAYER_SIZE * 2 - distance;
  const separationX = (nx * overlap) / 2;
  const separationY = (ny * overlap) / 2;

  player1.x -= separationX;
  player1.y -= separationY;
  player2.x += separationX;
  player2.y += separationY;

  // Apply damping to velocity
  player1.velocityX *= GAME_CONSTANTS.COLLISION_DAMPING;
  player1.velocityY *= GAME_CONSTANTS.COLLISION_DAMPING;
  player2.velocityX *= GAME_CONSTANTS.COLLISION_DAMPING;
  player2.velocityY *= GAME_CONSTANTS.COLLISION_DAMPING;
};

export const checkWallCollision = (player, width, height) => {
  const padding = GAME_CONSTANTS.PLAYER_SIZE;

  return {
    left: player.x < padding,
    right: player.x > width - padding,
    top: player.y < padding,
    bottom: player.y > height - padding,
  };
};

export const handleWallCollision = (player, width, height) => {
  const collisions = checkWallCollision(player, width, height);

  if (collisions.left) {
    player.x = GAME_CONSTANTS.PLAYER_SIZE;
    player.velocityX *= -GAME_CONSTANTS.COLLISION_DAMPING;
  }
  if (collisions.right) {
    player.x = width - GAME_CONSTANTS.PLAYER_SIZE;
    player.velocityX *= -GAME_CONSTANTS.COLLISION_DAMPING;
  }
  if (collisions.top) {
    player.y = GAME_CONSTANTS.PLAYER_SIZE;
    player.velocityY *= -GAME_CONSTANTS.COLLISION_DAMPING;
  }
  if (collisions.bottom) {
    player.y = height - GAME_CONSTANTS.PLAYER_SIZE;
    player.velocityY *= -GAME_CONSTANTS.COLLISION_DAMPING;
  }
};

export const checkTrackBoundaries = (player, track) => {
  // Simple check: if player goes far outside track bounds, reset position
  const { width, height } = track;
  const padding = 50;

  if (
    player.x < -padding ||
    player.x > width + padding ||
    player.y < -padding ||
    player.y > height + padding
  ) {
    return true; // Out of bounds
  }

  return false;
};