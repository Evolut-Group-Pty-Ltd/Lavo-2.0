precision highp float;

attribute vec2 uv;
attribute vec4 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;
varying float fogDepth;
#if spaceGradient > 0
  varying vec2 vNDC;
#endif

void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * position;
  gl_Position = projectionMatrix * mvPosition;
  
  #if spaceGradient > 0
    vNDC = gl_Position.xy / gl_Position.w;
  #endif
  fogDepth = -mvPosition.z;
}