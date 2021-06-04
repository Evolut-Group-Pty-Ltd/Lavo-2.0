#extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec2 vUv;
varying float fogDepth;

uniform sampler2D map;
uniform vec3 color;
uniform float opacity;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 msdf = texture2D(map, vUv).rgb;
  float sd = median(msdf.r, msdf.g, msdf.b) - .5;
  float dsd = fwidth(sd);
  float alpha = smoothstep(-dsd, dsd, sd);

  if (alpha < .003) discard;

  gl_FragColor = vec4(color, alpha * opacity);

  float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
}