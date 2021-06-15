import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { Global } from "../../Global"
import { rescale, lerp, smooth, saturate } from '../../../utils/interpolations';
import { Group, Color, Object3D, ShaderMaterial } from "three";

export class Earth extends Group {

  constructor({
    start,
    finish = start + 3,
    resourceName,
    position,
    scale = 1,
  }) {
    super()

    this.mesh = Global.assets.get(resourceName).scene.clone()

    this.mesh.position.set(
      position.x * Global.screen.halfBox.x, 
      position.y * Global.screen.halfBox.y,
      position.z * Global.settings.sceneDepth,
    )
    this.mesh.scale.setScalar(scale)

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: null },
        map: { value: null },
        opacity: { value: 1 },
        forceFog: { value: 0 },
        aspect: { value: Global.screen.aspect },
        fogColor: { value: new Color() },
        fogNear: { value: 1 },
        fogFar: { value: 2 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      fog: true,
    })
    
    this.radius = 0
    this.mesh.traverse(child => {
      if (child.isMesh) {
        const color = child.material.color
        const map  = child.material.map
        child.material = material.clone()
        child.material.uniforms.color.value = color
        child.material.uniforms.map.value = map

        const pos = child.geometry.getAttribute('position').array
        for (let i = 0; i < pos.length; i += 3) {
          const x = pos[i]
          const y = pos[i + 1]
          const z = pos[i + 2]
          this.radius = Math.max(this.radius, (x*x+y*y+z*z) * child.scale.x * child.scale.x)
        }
      }
    })
    this.radius = Math.sqrt(this.radius)
    this.add(this.mesh)

    this.initialScale = scale
    this.finalState = new Object3D()
    this.finalState.rotation.y = 2 * Math.PI
    this.finalStateFactor = 0
    this.temporalRotation = 0
    this.updateFinalState()

    this.start = start - .5
    this.finish = finish

    Global.eventBus.on('update', this.onUpdate)
    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('resize', this.onResize)
  }

  updateFinalState = () => {
    const finalScale = this.initialScale * 20
    this.finalState.scale.setScalar(finalScale)
    this.finalState.position.z = Global.settings.sceneDepth - this.radius * finalScale * 3
  }
  
  onProgress = progress => {
    this.visible = progress > this.start - 1 && progress <= this.finish
    if (this.visible) {
      const p = rescale(this.start, this.finish, progress)
      this.position.z = p * Global.settings.sceneDepth
      
      this.finalStateFactor = saturate((p * 6.5 - 5) / 1.5)
      this.finalStateFactor = 1 - smooth(1 - this.finalStateFactor * this.finalStateFactor)
      this.position.y = lerp(0, -this.mesh.position.y, this.finalStateFactor)
      this.position.z = lerp(this.position.z, this.finalState.position.z, this.finalStateFactor)
      this.mesh.scale.setScalar(lerp(this.initialScale, this.finalState.scale.x, this.finalStateFactor))
      this.mesh.traverse(child => {
        if (child.isMesh) {
          child.material.uniforms.forceFog.value = this.finalStateFactor
          child.material.uniforms.opacity.value = rescale(1, .9, this.finalStateFactor)
        }
      })
    }
  }

  onUpdate = ({ ds }) => {
    this.temporalRotation += ds
    if (this.finalStateFactor == 0) {
      this.temporalRotation = this.temporalRotation % (2 * Math.PI)
    }
    this.mesh.rotation.y = lerp(this.temporalRotation, this.finalState.rotation.y, this.finalStateFactor)
  }

  onResize = () => {
    this.mesh.traverse(child => {
      if (child.isMesh) {
        child.material.uniforms.aspect.value = Global.screen.aspect
      }
    })
  }
}