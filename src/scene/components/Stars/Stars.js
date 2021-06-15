import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { Vector2, Points, BufferGeometry, ShaderMaterial, BufferAttribute } from 'three';
import { Global } from '../../Global';

export class Stars extends Points {
  constructor({
    start,
    finish = start + 1,
  }) {
    
    const count = 100, size = count * 3
    const positions = new Float32Array(size)
    const phases = new Float32Array(count)
    for (let i = 0, j = 0; j < count; i += 3, j++) {
      positions[i    ] = Math.random() * 2 - 1
      positions[i + 1] = Math.random() * 2 - 1
      positions[i + 2] = 100 * Math.random()
      phases[j] = 23 * Math.random()
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('phase', new BufferAttribute(phases, 1))

    super(
      geometry,
      new ShaderMaterial({
        uniforms: {
          bounds: { value: Global.screen.halfBox },
          opacity: { value: 0 },
          time: { value: 0 },
          shift: { value: new Vector2() },
        },
        // transparent: true,
        vertexShader,
        fragmentShader,
      })
    )

    this.start = start
    this.finish = finish

    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('update', this.onUpdate)
    Global.eventBus.on('pointer', this.onPointer)
  }

  onProgress = progress => {
    this.visible = progress >= this.start && progress <= this.finish
    // if (this.visible) {
    //   const p = rescale(this.start, this.finish, progress)
    //   this.material.uniforms.opacity.value = smoothstep(1, .9, p)
    // }
  }

  onUpdate = ({ seconds }) => {
    this.material.uniforms.time.value = seconds
  }

  onPointer = pointer => {
    this.material.uniforms.shift.value.x = pointer.x * .3
    this.material.uniforms.shift.value.y = pointer.y * .6
  }
}