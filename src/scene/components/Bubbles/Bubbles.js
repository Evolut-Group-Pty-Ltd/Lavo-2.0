import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { ShaderMaterial, AdditiveBlending, PlaneBufferGeometry, Mesh, Vector2 } from "three";
import { rescale, smoothstep } from "../../util/interpolations";
import { Global } from '../../Global';

export class Bubbles extends Mesh {
  constructor({
    start,
    finish = start + 2,
  }) {
    super(
      new PlaneBufferGeometry(1, 1, 1, 1),
      new ShaderMaterial({
        uniforms: {
          opacity: { value: 0 },
          aspect: { value: Global.screen.aspect },
          progress: { value: 0 },
          speed: { value: 1 },
          time: { value: 0 },
          count: { value: 10 },
          shift: { value: new Vector2() },
        },
        vertexShader,
        fragmentShader,

        blending: AdditiveBlending,
        depthWrite: false,
        transparent: true,
      })
    )

    this.visible = false

    this.start = start - .5
    this.finish = finish - .5

    Global.eventBus.on('resize', this.onResize)
    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('update', this.onUpdate)
    Global.eventBus.on('pointer', this.onPointer)
  }

  prevProgress = 0

  onProgress = progress => {
    if (progress < this.start || progress > this.finish) {
      this.visible = false
    } else {
      const dProgress = Math.abs(progress - this.prevProgress) * 100
      this.prevProgress = progress

      this.visible = true
      const p = rescale(this.start, this.finish, progress)
      this.material.uniforms.opacity.value = smoothstep(0, .1, p) * smoothstep(1, .9, p)
      this.material.uniforms.progress.value = progress
      // this.material.uniforms.speed.value = dProgress
    }
  }

  onUpdate = ({ seconds }) => {
    this.material.uniforms.time.value = seconds
    // this.material.uniforms.speed.value = Math.sin(seconds) * .25 + .25
  }

  onResize = () => {
    this.material.uniforms.aspect.value = Global.screen.aspect
  }

  onPointer = pointer => {
    this.material.uniforms.shift.value.x =  pointer.x * .03
    this.material.uniforms.shift.value.y = -pointer.y * .06
  }
}