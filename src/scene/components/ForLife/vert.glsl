varying vec2 vUv;
// varying float fogDepth;

uniform float shift;
uniform float aspect;

void main() {
  vUv = vec2((uv.x - .5) * aspect + .5, uv.y - shift);

  // vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  // fogDepth = -mvPosition.z;

  gl_Position = vec4(2. * (uv - .5), 0., 1.);
}