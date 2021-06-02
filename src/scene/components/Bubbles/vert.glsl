varying vec2 vUv;

uniform vec2 shift;

void main() {
  vUv = uv + shift;

  gl_Position = vec4(2. * (uv - .5), 0., 1.);
}