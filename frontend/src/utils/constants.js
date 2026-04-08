export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export const GAME_CONFIG = {
  WIDTH: 1200,
  HEIGHT: 800,
  PLAYER_SIZE: 20,
  PLAYER_SPEED: 10,
  MAX_SPEED: 0.5,
  ROTATION_SPEED: 0.1,
};

export const COLORS = {
  RED: '#FF6B6B',
  BLUE: '#4ECDC4',
  GREEN: '#95E1D3',
  YELLOW: '#FFE66D',
  PURPLE: '#C7CEEA',
  PINK: '#FF9ECD',
  ORANGE: '#FFA07A',
  CYAN: '#87CEEB',
};

export const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished',
};