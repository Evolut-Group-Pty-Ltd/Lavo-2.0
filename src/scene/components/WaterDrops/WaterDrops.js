import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { SphereBufferGeometry, Group, Mesh, ShaderMaterial, Vector3, Color } from 'three';
import { Global } from '../../Global';
import { rescale, smoothstep, lerp } from '../../../utils/interpolations';

function hash(a, b, c, d) {
  const t = Math.abs(a + Math.sin(b + Math.sin(c + Math.sin(d))))
  return 1 + .2 * (t - Math.floor(t))
}

export class WaterDrops extends Group {
  constructor({
    start,
    finish = start + 4,
    swapStart = start + 2,
    swapFinish = start + 3,
    count = 100,
  }) {
    super()

    this.minusMaterial = new ShaderMaterial({
      uniforms: {
        color: { value: new Color(0x218CD9) },
        aspect: { value: Global.screen.aspect },
        opacity: { value: 1 },
        showCharge: { value: 0 },
        fogColor: { value: new Color() },
        fogNear: { value: 1 },
        fogFar: { value: 2 },
      },
      vertexShader,
      fragmentShader,
      fog: true,
      transparent: true,
    })
    this.plusMaterial = this.minusMaterial.clone()
    this.plusMaterial.defines.plus = 1

    const v3 = new Vector3()
    for (let i = 0; i < count; i++) {
      const geometry = new SphereBufferGeometry(1, 16, 8)
      const pos = geometry.getAttribute('position').array
      for (let j = 0; j < pos.length; j += 3) {
        const h = hash(pos[j], pos[j + 1], pos[j + 2], i)
        pos[j] *= h
        pos[j + 1] *= h
        pos[j + 2] *= h
      }

      v3.set(
        Math.random() * Global.screen.box.x - Global.screen.halfBox.x,
        Math.random() * Global.screen.box.y - Global.screen.halfBox.y,
        Math.random() * -Global.settings.sceneDepth
      )
      
      const charge = Math.random() >= .5
      const mesh = new Mesh(
        geometry,
        charge ? this.minusMaterial : this.plusMaterial
      )
      
      mesh.position.copy(v3)
      mesh.userData = {
        x: v3.x,
        z: v3.z,
        charge,
        needsSwap: v3.x >= 0 == charge,
        swapBias: Math.random() * .5 - .25
      }
      this.add(mesh)
    }

    this.count = count
    this.duration = finish - start
    this.start = start - .5
    this.finish = finish + .5
    this.swapStart = swapStart
    this.swapFinish = swapFinish
    
    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('update', this.onUpdate)
    Global.eventBus.on('resize', this.onResize)
  }

  onProgress = progress => {
    this.visible = progress >= this.start - .5 && progress <= this.finish
    if (this.visible) {
      const p = rescale(this.start, this.finish, progress)
      const swap = smoothstep(this.swapStart, this.swapFinish, progress)
      const zShift = p * this.duration * Global.settings.sceneDepth

      this.children.forEach(child => {
        child.position.z = (child.userData.z + zShift) % Global.settings.sceneDepth
        if (child.userData.needsSwap) {
          child.position.x = lerp(child.userData.x, -child.userData.x, swap + child.userData.swapBias)
        }
      })

      this.minusMaterial.uniforms.opacity.value = smoothstep(1, .9, p)
      this.plusMaterial.uniforms.opacity.value = smoothstep(1, .9, p)

      this.minusMaterial.uniforms.showCharge.value = smoothstep(.45, .5, p)
      this.plusMaterial.uniforms.showCharge.value = smoothstep(.45, .5, p)
    }
  }

  onUpdate = ({ seconds }) => {
    const d = seconds * .2 % Math.PI
    for (let i = 0; i < this.count; i++) {
      this.children[i].rotation.x = d + i
      this.children[i].rotation.y = i - d * d
    }
  }

  onResize = () => {
    this.minusMaterial.uniforms.aspect.value = Global.screen.aspect
    this.plusMaterial.uniforms.aspect.value = Global.screen.aspect
  }
}