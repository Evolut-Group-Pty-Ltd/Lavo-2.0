export function rescale(min, max, value) {
  return (value - min) / (max - min)
}

export function saturate(value) {
  return Math.max(0, Math.min(1, value))
}

export function smooth(value) {
  return value * value * (3 - 2 * value)
}

export function smoothstep(min, max, value) {
  let v = saturate(rescale(min, max, value))
  return smooth(v)
}

export function hold(startMin, startMax, finalMin, finalMax, value) {
  return .5 * (
    saturate(rescale(startMin, startMax, value)) + 
    saturate(rescale(finalMin, finalMax, value))
  )
}

export function smoothHold(startMin, startMax, finalMin, finalMax, value) {
  return smooth(hold(startMin, startMax, finalMin, finalMax, value))
}