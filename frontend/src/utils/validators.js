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

  const cleanCode = code.toUpperCase().trim();

  if (!/^[A-Z0-9]{6}$/.test(cleanCode)) {
    return { valid: false, error: 'Room code must be 6 uppercase alphanumeric characters' };
  }

  return { valid: true, code: cleanCode };
};