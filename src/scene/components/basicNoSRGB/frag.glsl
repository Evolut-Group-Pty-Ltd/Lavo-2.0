varying vec2 vUv;
varying float fogDepth;

uniform sampler2D map;
uniform float opacity;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {
  vec3 texel = texture2D(map, vUv).rgb;
  gl_FragColor = vec4(texel, opacity);

  float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
}