varying vec2 vUv;
varying float fogDepth;

void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  
  fogDepth = -mvPosition.z;
}