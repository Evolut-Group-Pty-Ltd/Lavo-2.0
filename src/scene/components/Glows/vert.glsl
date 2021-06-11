varying float fogDepth;

attribute vec2 direction;

uniform vec3 halfBox;
uniform float amplitude;
uniform float offset;

void main() {
  vec3 pos = position +
             offset * vec3(direction.x, direction.y, 0.) +
             amplitude * vec3(direction.y, -direction.x, 0.);

  pos = mod(pos + halfBox, halfBox * 2.) - halfBox;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
  fogDepth = -mvPosition.z;

  gl_PointSize = 64.;
  gl_Position = projectionMatrix * mvPosition;
}