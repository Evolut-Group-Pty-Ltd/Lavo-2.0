import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { Color, Points, BufferGeometry, ShaderMaterial, BufferAttribute } from 'three';
import { Global } from '../../Global';

export class Stars extends Points {
  constructor({
    start,
    finish = start + 1,
  }) {
    
    const count = 100, size = count * 3
    const positions = new Float32Array(size)
    for (let i = 0; i < size; i++) {
      positions[i    ] = 200 * Math.random() - 100
      positions[i + 1] = 200 * Math.random() - 100
      positions[i + 2] = 200 * Math.random() - 100
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))

    super(
      geometry,
      new ShaderMaterial({
        uniforms: {

        },
        vertexShader,
        fragmentShader,
      })
    )

    this.start = start
    this.finish = finish

    Global.eventBus.on('progress', this.onProgress)
  }

  onProgress = progress => {
    this.visible = progress >= this.start && progress <= this.finish
    if (this.visible) {
      
    }
  }
}