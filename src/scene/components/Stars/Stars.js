import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { Vector2, Points, BufferGeometry, ShaderMaterial, BufferAttribute } from 'three';
import { Global } from '../../Global';
import { rescale, smoothstep } from '../../../utils/interpolations';

export class Stars extends Points {
  constructor({
    start,
    finish = start + 1,
  }) {
    
    const count = 100, size = count * 3
    const positions = new Float32Array(size)
    for (let i = 0; i < size; i++) {
      positions[i    ] = Math.random() * Global.screen.box.x - Global.screen.halfBox.x
      positions[i + 1] = Math.random() * Global.screen.box.y - Global.screen.halfBox.y
      positions[i + 2] = 200 * Math.random() - 100
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))

    super(
      geometry,
      new ShaderMaterial({
        uniforms: {
          opacity: { value: 0 },
          shift: { value: new Vector2() },
        },
        transparent: true,
        vertexShader,
        fragmentShader,
      })
    )

    this.start = start
    this.finish = finish

    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('pointer', this.onPointer)
  }

  onProgress = progress => {
    this.visible = progress >= this.start && progress <= this.finish
    if (this.visible) {
      const p = rescale(this.start, this.finish, progress)
      this.material.uniforms.opacity.value = smoothstep(1, .9, p)
    }
  }

  onPointer = pointer => {
    this.material.uniforms.shift.value.x = pointer.x * .3
    this.material.uniforms.shift.value.y = pointer.y * .6
  }
}