varying vec2 vUv;
varying float fogDepth;
varying vec3 vWorldNormal;

uniform float time;

void main() {
  vUv = uv;
  vWorldNormal = (modelMatrix * vec4(normal, 0.)).xyz;

  vec3 pos = position;
  vec2 wave = pos.yz * (1. + (.25 + .25 * smoothstep(0., -3., pos.x)) * sin(time + pos.x * 2. + length(pos.yz)));
  pos.yz = mix(pos.yz, wave, smoothstep(0., -.25, pos.x));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
  gl_Position = projectionMatrix * mvPosition;
  
  fogDepth = -mvPosition.z;
}