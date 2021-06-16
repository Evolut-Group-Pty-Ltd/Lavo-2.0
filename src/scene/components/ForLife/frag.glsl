// varying float fogDepth;
varying vec2 vUv;

uniform sampler2D map;
uniform vec3 color;
uniform float pointSize;
uniform float videoSize;
uniform float opacity;
uniform float crownMin;
uniform float crownMax;
uniform float insideSize;
uniform float insideSizeMax;
// uniform vec3 fogColor;
// uniform float fogNear;
// uniform float fogFar;

void main() {
  float d = length(vUv - .5) * pointSize;
  if (d > .5) {
    discard;
  }

  vec2 videoUV = (vUv - .5) * videoSize + .5;
  vec3 texel = texture2D(map, videoUV).rgb;
  texel += 1. - step(0., videoUV.x) * step(videoUV.x, 1.) * step(0., videoUV.y) * step(videoUV.y, 1.);
  texel = clamp(texel, 0., 1.);

  float inside = smoothstep(insideSizeMax, insideSize, d);
  float alpha = clamp(smoothstep(crownMax, crownMin, d) * .5 + inside, 0., 1.);
  vec3 c = mix(color, texel, inside);
  gl_FragColor = vec4(c, alpha * opacity);

  // float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
  // gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
}