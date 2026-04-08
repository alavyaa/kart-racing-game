import { gameState } from '../models/GameState.js';
import { handlePlayerCollision, handleWallCollision } from '../physics/collisionDetection.js';
import { GAME_CONSTANTS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

const gameLoops = new Map(); // roomCode -> gameLoopInterval

export const setupGameEvents = (socket, io) => {
  socket.on('game:start', (data, callback) => {
    try {
      const roomCode = socket.data.roomCode;

      if (!roomCode) {
        return callback({ success: false, error: 'Not in a room' });
      }

      const room = gameState.getRoom(roomCode);
      if (!room) {
        return callback({ success: false, error: 'Room not found' });
      }

      if (room.hostId !== socket.id) {
        return callback({ success: false, error: 'Only host can start game' });
      }

      const result = gameState.startGame(roomCode);

      if (result.success) {
        logger.info(`Game started in room ${roomCode}`);

        callback({ success: true });
        io.to(roomCode).emit('game:started', {
          startTime: result.startTime,
        });

        // Start game loop if not already running
        if (!gameLoops.has(roomCode)) {
          startGameLoop(roomCode, io);
        }
      } else {
        callback(result);
      }
    } catch (error) {
      logger.error('Error starting game:', error);
      callback({ success: false, error: 'Failed to start game' });
    }
  });

  socket.on('game:stop', (data, callback) => {
    try {
      const roomCode = socket.data.roomCode;

      if (!roomCode) {
        return callback({ success: false, error: 'Not in a room' });
      }

      const room = gameState.getRoom(roomCode);
      if (!room) {
        return callback({ success: false, error: 'Room not found' });
      }

      if (room.hostId !== socket.id) {
        return callback({ success: false, error: 'Only host can stop game' });
      }

      const result = gameState.stopGame(roomCode);

      if (result.success) {
        logger.info(`Game stopped in room ${roomCode}`);

        callback({ success: true });
        io.to(roomCode).emit('game:stopped');

        // Stop game loop
        if (gameLoops.has(roomCode)) {
          clearInterval(gameLoops.get(roomCode));
          gameLoops.delete(roomCode);
        }
      } else {
        callback(result);
      }
    } catch (error) {
      logger.error('Error stopping game:', error);
      callback({ success: false, error: 'Failed to stop game' });
    }
  });

  socket.on('game:playerInput', (data) => {
    try {
      const roomCode = socket.data.roomCode;
      const { inputState } = data;

      if (!roomCode || !inputState) {
        return;
      }

      // Update player input in game state
      gameState.updatePlayerInput(roomCode, socket.id, inputState);
    } catch (error) {
      logger.error('Error updating player input:', error);
    }
  });

  socket.on('disconnect', () => {
    // Cleanup when player disconnects
    const roomCode = socket.data.roomCode;
    if (roomCode) {
      const result = gameState.leaveRoom(roomCode, socket.id);

      // Notify other players
      io.to(roomCode).emit('room:updated', result.room);

      // Stop game loop if room is empty
      if (result.empty && gameLoops.has(roomCode)) {
        clearInterval(gameLoops.get(roomCode));
        gameLoops.delete(roomCode);
      }
    }
  });
};

function startGameLoop(roomCode, io) {
  const tickInterval = 1000 / GAME_CONSTANTS.TICK_RATE;

  const loopId = setInterval(() => {
    try {
      const room = gameState.getRoom(roomCode);

      if (!room) {
        clearInterval(loopId);
        gameLoops.delete(roomCode);
        return;
      }

      if (room.gameState !== 'playing') {
        return;
      }

      // Update game state
      room.tick();

      // Handle collisions
      const players = Array.from(room.players.values());

      // Player-to-player collisions
      for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
          const p1 = players[i];
          const p2 = players[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < GAME_CONSTANTS.PLAYER_SIZE * 2) {
            handlePlayerCollision(p1, p2);
          }
        }
      }

      // Wall collisions
      for (const player of players) {
        handleWallCollision(player, GAME_CONSTANTS.GAME_WIDTH, GAME_CONSTANTS.GAME_HEIGHT);
      }

      // Broadcast game state to room
      io.to(roomCode).emit('game:stateUpdate', room.getFullState());
    } catch (error) {
      logger.error(`Error in game loop for room ${roomCode}:`, error);
    }
  }, tickInterval);

  gameLoops.set(roomCode, loopId);
}