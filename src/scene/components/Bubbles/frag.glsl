varying vec2 vUv;

uniform float opacity;
uniform float progress;
uniform float speed;
uniform float aspect;
uniform float count;
uniform float time;

float hash(in vec2 p) {
  p = fract(p * vec2(7235.4581, 327.1374));
  p += dot(p, p + 14.2679);
  return fract(p.x * p.y);
}

float bubble(in vec2 uv, in float layer) {

  float z = fract(layer + time * .1 + progress);
  float layerScale = 10. * (1. - z);
  uv = layerScale * (uv - .5);
  uv *= vec2(aspect, 1.) * count;

  vec2 dir = normalize(floor(uv));

  float id = hash(floor(uv) + layer * 27.8721);
  float radius = id * 8. - 7.5;
  if (radius <= 0.)
    return 0.;

  float appear = .25 * radius;

  radius = radius * .8 + sin(time + id * 512.8653) * .2;
  uv = (fract(uv) - .5) * 2.;

  // radius *= mix(1., abs(dot(uv, dir)), speed * 2.);

  float dist = length(uv);
  float outline = .05;

  float border = smoothstep(radius - outline, radius, dist) * smoothstep(radius + outline, radius, dist);
  
  // gl_FragColor = vec4(vec3(abs(dot(uv, dir))), 1.);

  return border * smoothstep(appear, .25 + appear, z);
}

void main() {
  float color = 0.;

  color += bubble(vUv, .75);
  color += bubble(vUv, .5);
  color += bubble(vUv, .25);
  color += bubble(vUv, 0.);

  color = min(color, 1.);

  gl_FragColor = vec4(vec3(color), opacity);
}