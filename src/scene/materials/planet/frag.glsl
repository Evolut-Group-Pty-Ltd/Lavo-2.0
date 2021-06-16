#define sqrtHalf .7071067811865476
#define s(x) clamp(x, 0., 1.)

varying vec2 vUv;
varying float fogDepth;
varying vec3 vWorldNormal;
varying vec2 vNDC;

uniform float aspect;
uniform vec3 color;
uniform sampler2D map;
uniform float fresnelPower;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {
  vec3 texel = texture2D(map, vUv).rgb;

  vec3 normal = normalize(vWorldNormal);
  vec3 light = .25 +
    vec3(.5, .5, 1.) * s(dot(normal, normalize(vec3(.2, 0., 1.)))) +
    vec3(1., 1., .75) * s(-dot(normal, vec3(sqrtHalf, 0., sqrtHalf)));

  vec3 finalColor = texel * color * light;

  float fresnelFactor = abs(normal.z);
  finalColor = finalColor * (1. - fresnelPower * fresnelFactor);

  vec2 ndc = vNDC;
  ndc.x *= aspect;
  float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
  vec3 fogGradient = mix(vec3(0.173,0.059,0.271), vec3(0.024,0.024,0.208), min(1., length(ndc)));
  finalColor = mix(finalColor, fogGradient, fogFactor);

  gl_FragColor = vec4(s(finalColor), 1.);
}