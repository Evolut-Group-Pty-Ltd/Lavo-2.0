varying float fogDepth;

attribute vec2 direction;

uniform float amplitude;
uniform float offset;

void main() {
  vec3 pos = position +
             offset * vec3(direction.x, direction.y, 0.) +
             amplitude * vec3(direction.y, -direction.x, 0.);

  pos = mod(pos + 100., 200.) - 100.;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
  fogDepth = -mvPosition.z;

  gl_PointSize = 64.;
  gl_Position = projectionMatrix * mvPosition;
}