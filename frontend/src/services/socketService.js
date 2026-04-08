import { io } from 'socket.io-client';
import { SERVER_URL } from '../utils/constants';

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(SERVER_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Room event wrappers
export const createRoom = (username) => {
  return new Promise((resolve, reject) => {
    getSocket().emit('room:create', { username }, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error));
      }
    });
  });
};

export const joinRoom = (username, roomCode) => {
  return new Promise((resolve, reject) => {
    getSocket().emit('room:join', { username, roomCode }, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error));
      }
    });
  });
};

export const leaveRoom = () => {
  return new Promise((resolve, reject) => {
    getSocket().emit('room:leave', {}, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error));
      }
    });
  });
};

export const listRooms = () => {
  return new Promise((resolve, reject) => {
    getSocket().emit('room:list', {}, (response) => {
      if (response.success) {
        resolve(response.rooms);
      } else {
        reject(new Error(response.error));
      }
    });
  });
};

export const getRoomState = () => {
  return new Promise((resolve, reject) => {
    getSocket().emit('room:getState', {}, (response) => {
      if (response.success) {
        resolve(response.room);
      } else {
        reject(new Error(response.error));
      }
    });
  });
};

// Game event wrappers
export const startGame = () => {
  return new Promise((resolve, reject) => {
    getSocket().emit('game:start', {}, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error));
      }
    });
  });
};

export const stopGame = () => {
  return new Promise((resolve, reject) => {
    getSocket().emit('game:stop', {}, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error));
      }
    });
  });
};

export const sendPlayerInput = (inputState) => {
  getSocket().emit('game:playerInput', { inputState });
};

// Event listeners
export const onRoomUpdated = (callback) => {
  getSocket().on('room:updated', callback);
};

export const onRoomHostChanged = (callback) => {
  getSocket().on('room:hostChanged', callback);
};

export const onGameStarted = (callback) => {
  getSocket().on('game:started', callback);
};

export const onGameStopped = (callback) => {
  getSocket().on('game:stopped', callback);
};

export const onGameStateUpdate = (callback) => {
  getSocket().on('game:stateUpdate', callback);
};

// Remove event listeners
export const offRoomUpdated = (callback) => {
  getSocket().off('room:updated', callback);
};

export const offGameStateUpdate = (callback) => {
  getSocket().off('game:stateUpdate', callback);
};