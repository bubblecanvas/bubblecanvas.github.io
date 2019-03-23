export function getMagnitude(v) {
  return Math.sqrt(Math.pow(v.x,2) + Math.pow(v.y,2));
}

export function getCosineTheta(v) {
  return v.x / getMagnitude(v);
}

export function getSineTheta(v) {
  return v.y / getMagnitude(v);
}
