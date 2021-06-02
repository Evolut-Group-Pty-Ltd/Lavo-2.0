export function smoothstep(min, max, value) {
  let x = Math.max(0, Math.min(1, rescale(min, max, value)))
  return x * x * (3 - 2 * x)
}

export function rescale(min, max, value) {
  return (value - min) / (max - min)
}