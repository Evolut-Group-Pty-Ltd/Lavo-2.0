varying vec2 vUv;
varying float fogDepth;
varying vec3 vWorldNormal;
varying vec2 vNDC;

void main() {
  vUv = uv;
  vWorldNormal = (modelMatrix * vec4(normal, 0.)).xyz;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  
  vNDC = gl_Position.xy / gl_Position.w;
  fogDepth = -mvPosition.z;
}