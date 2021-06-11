#extension GL_OES_standard_derivatives : enable

precision highp float;

varying vec2 vUv;
varying float fogDepth;
#if spaceGradient > 0
  varying vec2 vNDC;
#endif

uniform sampler2D map;
uniform vec3 color;
uniform float opacity;
uniform float aspect;
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
  #if spaceGradient > 0
    vec2 ndc = vNDC;
    ndc.x *= aspect;
    vec3 fogGradient = mix(vec3(0.173,0.059,0.271), vec3(0.024,0.024,0.208), min(1., length(ndc)));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogGradient, fogFactor);
  #else
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
  #endif
}