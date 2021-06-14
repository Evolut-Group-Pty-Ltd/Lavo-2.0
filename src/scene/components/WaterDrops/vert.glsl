varying float fogDepth;
varying vec3 vWorldNormal;
varying vec2 vUv;

uniform float aspect;

void main() {
  vWorldNormal = (modelMatrix * vec4(normal, 0.)).xyz;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  
  vec4 center = projectionMatrix * modelViewMatrix * vec4(0., 0., 0., 1.);
  vUv = gl_Position.xy / gl_Position.w - center.xy / center.w;
  vUv.x *= aspect;
  
  fogDepth = -mvPosition.z;
}