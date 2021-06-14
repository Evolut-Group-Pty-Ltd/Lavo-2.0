#define sqrtHalf .7071067811865476
#define s(x) clamp(x, 0., 1.)

varying float fogDepth;
varying vec3 vWorldNormal;
varying vec2 vUv;

uniform vec3 color;
uniform float opacity;
uniform float showCharge;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {

  vec3 normal = normalize(vWorldNormal);
  float lightInfluence = dot(normal, vec3(sqrtHalf, 0., sqrtHalf));
  vec3 light = .6 + .4 * s(lightInfluence) + .4 * s(-lightInfluence) * vec3(0., .467, .745);

  vec3 finalColor = color * light;

  float fresnelFactor = abs(normal.z);
  finalColor = mix(fogColor, finalColor, fresnelFactor);

  vec2 uv = abs(vUv * 10.);
  float charge = smoothstep(.225, .205, uv.x) * smoothstep(.06, .04, uv.y);

  #ifdef plus
  charge += smoothstep(.225, .205, uv.y) * smoothstep(.06, .04, uv.x);
  charge = min(1., charge);
  #endif
  
  finalColor += charge * showCharge;

  float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
  finalColor = mix(finalColor, s(fogColor), fogFactor);

  gl_FragColor = vec4(finalColor, opacity);
}