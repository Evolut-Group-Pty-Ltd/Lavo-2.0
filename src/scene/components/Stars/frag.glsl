varying float vPhase;

uniform float opacity;
uniform float time;

void main() {
  float size = .2 + max(0., .3 - mod(time + vPhase, 23.));

  if (length(gl_PointCoord - vec2(.5)) > size) {
    discard;
  }
  gl_FragColor = vec4(vec3(1.), opacity);
}