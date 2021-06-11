#define sqrtHalf .7071067811865476
#define s(x) clamp(x, 0., 1.)

varying vec2 vUv;
varying float fogDepth;
varying vec3 vWorldNormal;

uniform vec3 color;
uniform sampler2D map;
uniform float fresnelPower;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {
  vec3 texel = texture2D(map, vUv).rgb;

  vec3 normal = normalize(vWorldNormal);
  float lightInfluence = dot(normal, vec3(sqrtHalf, 0., sqrtHalf));
  vec3 light = .25 +
    vec3(.5, .5, 1.) * s(lightInfluence) +
    vec3(1., 1., .75) * s(-lightInfluence);

  vec3 finalColor = texel * color * light;

  float fresnelFactor = abs(normal.z);
  finalColor = finalColor * (1. - fresnelPower * fresnelFactor);

  float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
  finalColor = mix(finalColor, fogColor, fogFactor);

  gl_FragColor = vec4(s(finalColor), 1.);
}