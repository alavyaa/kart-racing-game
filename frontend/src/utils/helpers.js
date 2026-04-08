export const calculateDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

export const normalizeAngle = (angle) => {
  while (angle < 0) angle += Math.PI * 2;
  while (angle >= Math.PI * 2) angle -= Math.PI * 2;
  return angle;
};

export const lerp = (a, b, t) => {
  return a + (b - a) * t;
};

export const interpolatePosition = (currentPos, targetPos, factor = 0.1) => {
  return {
    x: lerp(currentPos.x, targetPos.x, factor),
    y: lerp(currentPos.y, targetPos.y, factor),
  };
};

export const formatTime = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};