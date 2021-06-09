import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { Color, Points, BufferGeometry, ShaderMaterial, BufferAttribute } from 'three';
import { Global } from '../../Global';
import { smoothstep, rescale, saturate } from '../../util/interpolations';
import { Vector2 } from 'three';
import { AdditiveBlending } from 'three';

export class Glows extends Points {
  constructor({
    start,
    finish = start + 1,
  }) {
    
    const count = 50, size = count * 3, dirSize = count * 2
    const positions = new Float32Array(size)
    const directions = new Float32Array(dirSize)
    for (let i = 0; i < size; i++) {
      positions[i    ] = 100 * Math.random() - 50
      positions[i + 1] = 100 * Math.random() - 50
      positions[i + 2] = 10 * Math.random() - 5
    }
    const v2 = new Vector2()
    for (let i = 0; i < dirSize; i++) {
      v2.set(Math.random() * 2 - 1, Math.random() * 2 - 1).normalize()
      directions[i    ] = v2.x
      directions[i + 1] = v2.y
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('direction', new BufferAttribute(directions, 2))

    super(
      geometry,
      new ShaderMaterial({
        uniforms: {
          amplitude: { value: 0 },
          offset: { value: 0 },
          color: { value: new Color(0xFEFFBC) },
          opacity: { value: 0 },
          fogColor: { value: new Color() },
          fogNear: { value: 1 },
          fogFar: { value: 2 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        fog: true,
        blending: AdditiveBlending,
        depthWrite: false,
      })
    )

    this.preStart = start - .5
    this.start = start
    this.finish = finish

    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('update', this.onUpdate)
  }

  onProgress = progress => {
    this.visible = progress >= this.preStart && progress <= this.finish
    if (this.visible) {
      const preP = saturate(rescale(
        this.preStart,
        this.start,
        progress
      ))
      const p = saturate(rescale(
        this.start,
        this.finish,
        progress
      ))
      this.position.z = (p * .9 + preP * .1) * Global.settings.sceneDepth
      this.material.uniforms.opacity.value = smoothstep(1, .95, p)
    }
  }

  onUpdate = ({ seconds }) => {
    this.material.uniforms.amplitude.value = Math.sin(seconds)
    this.material.uniforms.offset.value = seconds * 10
  }
}