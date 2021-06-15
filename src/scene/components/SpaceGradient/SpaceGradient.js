import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { Mesh } from "three";
import { PlaneBufferGeometry } from "three";
import { Global } from "../../Global";
import { ShaderMaterial } from "three";
import { smoothstep } from '../../../utils/interpolations';

export class SpaceGradient extends Mesh {
  constructor({
    start = 0,
    finish = 4,
  }) {
    super(
      new PlaneBufferGeometry(1, 1, 1, 1),
      new ShaderMaterial({
        uniforms: {
          aspect: { value: Global.screen.aspect },
          opacity: { value: 1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      })
    )
    this.onResize()

    this.start = start
    this.finish = finish

    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('resize', this.onResize)
  }

  onProgress = progress => {
    this.visible = progress >= this.start && progress <= this.finish
    this.material.uniforms.opacity.value = smoothstep(this.start, this.start + .25, progress)
  }

  onResize = () => {
    this.scale.set(Global.screen.box.x * 1.1, Global.screen.box.y * 1.1, 1)
    this.material.uniforms.aspect.value = Global.screen.aspect
  }
}