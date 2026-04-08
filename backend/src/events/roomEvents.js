import { v4 as uuidv4 } from 'uuid';
import { gameState } from '../models/GameState.js';
import { validateUsername, validateRoomCode } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const setupRoomEvents = (socket, io) => {
  socket.on('room:create', (data, callback) => {
    try {
      const { username } = data;

      // Validate username
      const validation = validateUsername(username);
      if (!validation.valid) {
        return callback({ success: false, error: validation.error });
      }

      // Generate unique room code
      let roomCode = generateRoomCode();
      while (gameState.rooms.has(roomCode)) {
        roomCode = generateRoomCode();
      }

      // Create room
      const result = gameState.createRoom(roomCode, socket.id, username);

      if (result.success) {
        // Join the socket to the room
        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.username = username;
        socket.data.playerId = socket.id;

        logger.info(`Player ${username} created room ${roomCode}`);

        callback({
          success: true,
          roomCode,
          room: result.room,
        });

        // Broadcast room update
        io.to(roomCode).emit('room:updated', result.room);
      } else {
        callback(result);
      }
    } catch (error) {
      logger.error('Error creating room:', error);
      callback({ success: false, error: 'Failed to create room' });
    }
  });

  socket.on('room:join', (data, callback) => {
    try {
      const { username, roomCode } = data;

      // Validate inputs
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        return callback({ success: false, error: usernameValidation.error });
      }

      const codeValidation = validateRoomCode(roomCode);
      if (!codeValidation.valid) {
        return callback({ success: false, error: codeValidation.error });
      }

      // Join room
      const result = gameState.joinRoom(roomCode, socket.id, username);

      if (result.success) {
        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.username = username;
        socket.data.playerId = socket.id;

        logger.info(`Player ${username} joined room ${roomCode}`);

        callback({
          success: true,
          room: result.room,
        });

        // Broadcast room update
        io.to(roomCode).emit('room:updated', result.room);
      } else {
        callback(result);
      }
    } catch (error) {
      logger.error('Error joining room:', error);
      callback({ success: false, error: 'Failed to join room' });
    }
  });

  socket.on('room:leave', (data, callback) => {
    try {
      const roomCode = socket.data.roomCode;
      const username = socket.data.username;

      if (!roomCode) {
        return callback({ success: false, error: 'Not in a room' });
      }

      // Leave room
      const result = gameState.leaveRoom(roomCode, socket.id);

      socket.leave(roomCode);
      delete socket.data.roomCode;
      delete socket.data.username;
      delete socket.data.playerId;

      logger.info(`Player ${username} left room ${roomCode}`);

      if (callback) {
        callback({ success: true });
      }

      // Broadcast update if room still exists
      if (result.room) {
        io.to(roomCode).emit('room:updated', result.room);
      }

      if (result.hostChanged) {
        io.to(roomCode).emit('room:hostChanged', {
          newHostId: result.newHostId,
        });
      }
    } catch (error) {
      logger.error('Error leaving room:', error);
      if (callback) callback({ success: false, error: 'Failed to leave room' });
    }
  });

  socket.on('room:list', (data, callback) => {
    try {
      const rooms = gameState.getAllPublicRooms();
      callback({ success: true, rooms });
    } catch (error) {
      logger.error('Error listing rooms:', error);
      callback({ success: false, error: 'Failed to list rooms' });
    }
  });

  socket.on('room:getState', (data, callback) => {
    try {
      const roomCode = socket.data.roomCode;

      if (!roomCode) {
        return callback({ success: false, error: 'Not in a room' });
      }

      const room = gameState.getRoom(roomCode);
      if (room) {
        callback({ success: true, room: room.getState() });
      } else {
        callback({ success: false, error: 'Room not found' });
      }
    } catch (error) {
      logger.error('Error getting room state:', error);
      callback({ success: false, error: 'Failed to get room state' });
    }
  });
};