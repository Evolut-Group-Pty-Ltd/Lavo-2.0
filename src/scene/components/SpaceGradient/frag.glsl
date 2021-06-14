varying vec2 vNDC;

uniform float aspect;
uniform float opacity;

void main() {
  vec2 ndc = vNDC;
  ndc.x *= aspect;
  gl_FragColor = vec4(mix(vec3(0.173,0.059,0.271), vec3(0.024,0.024,0.208), min(1., length(ndc))), opacity);
}