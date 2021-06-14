varying vec2 vUv;
varying float fogDepth;
varying vec3 vWorldNormal;

void main() {
  vUv = uv;
  vWorldNormal = (modelMatrix * vec4(normal, 0.)).xyz;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  
  fogDepth = -mvPosition.z;
}