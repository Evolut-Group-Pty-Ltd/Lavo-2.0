precision highp float;

attribute vec2 uv;
attribute vec4 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;
varying float fogDepth;

void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * position;
  gl_Position = projectionMatrix * mvPosition;
  
  fogDepth = -mvPosition.z;
}