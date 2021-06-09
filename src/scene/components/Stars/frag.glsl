uniform float opacity;

void main() {
  if (length(gl_PointCoord - vec2(.5)) > 0.475) {
    discard;
  }
  gl_FragColor = vec4(vec3(1.), opacity);
}