import vertexShader from '../../materials/space/vert.glsl'
import fragmentShader from '../../materials/space/frag.glsl'

import { Global } from "../../Global"
import { Group, Vector3, ShaderMaterial, Color } from "three";

export class Rocket extends Group {
  constructor({
    resourceName,
    scale = 2,
  }) {
    super()

    this.speed = 15

    this.mesh = Global.assets.get(resourceName).scene.clone()
    this.resetPosition()
    this.mesh.rotation.reorder('XZY')
    this.mesh.rotation.z = -Math.atan(Global.screen.aspect)
    this.mesh.scale.setScalar(scale)

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: new Vector3(3, 3, 3) }, // maybe looks like a crutch, but for shader this is ok
        map: { value: null },
        fresnelPower: { value: .75 },
        aspect: { value: Global.screen.aspect },
        fogColor: { value: new Color() },
        fogNear: { value: 1 },
        fogFar: { value: 2 },
      },
      vertexShader,
      fragmentShader,
      fog: true,
    })
    
    this.mesh.traverse(child => {
      if (child.isMesh) {
        const map  = child.material.map
        child.material = material.clone()
        child.material.uniforms.map.value = map
      }
    })
    this.add(this.mesh)

    Global.eventBus.on('update', this.onUpdate)
    Global.eventBus.on('resize', this.onResize)
  }

  resetPosition = () => {
    this.mesh.position.x = -8 * this.speed * Global.screen.aspect
    this.mesh.position.y = -8 * this.speed
  }

  onUpdate = ({ seconds, ds }) => {

    this.mesh.position.x += ds * this.speed * Global.screen.aspect
    this.mesh.position.y += ds * this.speed
    this.mesh.rotation.y = seconds
    
    const dist = this.mesh.position.length()
    if (dist < 1 || dist > 300) {
      this.resetPosition()
    }
  }

  onResize = () => {
    this.mesh.rotation.z = -Math.atan(Global.screen.aspect)
    this.mesh.traverse(child => {
      if (child.isMesh) {
        child.material.uniforms.aspect.value = Global.screen.aspect
      }
    })
  }
}