export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 2) {
    return { valid: false, error: 'Username must be at least 2 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be at most 20 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { valid: true };
};

export const validateRoomCode = (code) => {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Room code is required' };
  }

  if (!/^[A-Z0-9]{6}$/.test(code)) {
    return { valid: false, error: 'Room code must be 6 uppercase alphanumeric characters' };
  }

  return { valid: true };
};

export const validatePlayerData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Player data is required' };
  }

  const { x, y, velocityX, velocityY, rotation, isAccelerating, isDrifting } = data;

  if (typeof x !== 'number' || typeof y !== 'number') {
    return { valid: false, error: 'Invalid position' };
  }

  if (typeof rotation !== 'number' || rotation < 0 || rotation >= Math.PI * 2) {
    return { valid: false, error: 'Invalid rotation' };
  }

  return { valid: true };
};