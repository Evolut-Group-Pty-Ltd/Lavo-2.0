#define sqrtHalf .7071067811865476
#define s(x) clamp(x, 0., 1.)

varying vec2 vUv;
varying float fogDepth;
varying vec3 vWorldNormal;

uniform vec3 color;
uniform sampler2D map;
uniform float opacity;
uniform float fresnelPower;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {
  vec3 texel = texture2D(map, vUv).rgb;

  vec3 normal = normalize(vWorldNormal);
  float lightInfluence = dot(normal, vec3(sqrtHalf, 0., sqrtHalf));
  vec3 light = .6 + .4 * s(lightInfluence) + .4 * s(-lightInfluence) * vec3(0., .467, .745);

  vec3 finalColor = s(texel * color * light);

  float fresnelFactor = fresnelPower * (1. - abs(normal.z));
  finalColor = mix(finalColor, fogColor, fresnelFactor);

  float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
  finalColor = mix(finalColor, fogColor, fogFactor);

  gl_FragColor = vec4(finalColor, opacity);
}