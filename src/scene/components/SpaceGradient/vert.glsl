varying vec2 vNDC;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  vNDC = gl_Position.xy / gl_Position.w;
}