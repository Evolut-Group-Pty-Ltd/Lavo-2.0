attribute float phase;

varying float vPhase;

uniform vec2 shift;

void main() {
  vPhase = phase;

  vec3 pos = position;
  pos.xy -= shift;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);

  gl_PointSize = -5000. / mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}