import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { Mesh } from "three";
import { PlaneBufferGeometry } from "three";
import { Global } from "../../Global";
import { ShaderMaterial } from "three";

export class SpaceGradient extends Mesh {
  constructor({
    start = 0,
    finish = 4,
  }) {
    super(
      new PlaneBufferGeometry(Global.screen.box.x, Global.screen.box.y, 1, 1),
      new ShaderMaterial({
        uniforms: {
          aspect: { value: Global.screen.aspect },
        },
        vertexShader,
        fragmentShader,
      })
    )

    this.start = start
    this.finish = finish

    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('resize', this.onResize)
  }

  onProgress = progress => {
    this.visible = progress >= this.start && progress <= this.finish
  }

  onResize = () => {
    this.material.uniforms.aspect.value = Global.screen.aspect
  }
}