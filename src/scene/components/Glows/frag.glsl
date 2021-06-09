varying float fogDepth;

uniform vec3 color;
uniform float opacity;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {
  float d = length(gl_PointCoord - vec2(.5));
  if (d > .5) {
    discard;
  }
  float alpha = smoothstep(.5, .2, d) * .5 + step(d, .1);
  alpha = clamp(alpha, 0., 1.);
  gl_FragColor = vec4(color, alpha * opacity);

  float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.), fogFactor);
  // gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
}