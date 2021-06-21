import vertexShader from '../../materials/planet/vert.glsl'
import fragmentShader from '../../materials/planet/frag.glsl'

import { Global } from "../../Global"
import { rescale, smoothstep } from '../../../utils/interpolations';
import { Group, Color, ShaderMaterial } from "three";
import { Rocket } from './Rocket';

export class Moon extends Group {

  constructor({
    start,
    finish = start + 2,
    resourceName,
    position,
    scale = 1,
    rocketResourceName,
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
        fresnelPower: { value: .25 },
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
        const color = child.material.color
        const map  = child.material.map
        child.material = material.clone()
        child.material.uniforms.color.value = color
        child.material.uniforms.map.value = map
      }
    })
    this.add(this.mesh)

    this.rocket = new Rocket({
      resourceName: rocketResourceName,
    })
    this.add(this.rocket)

    this.start = start - .5
    this.finish = finish - .5

    Global.eventBus.on('update', this.onUpdate)
    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('resize', this.onResize)
  }
  
  onProgress = progress => {
    this.visible = progress > this.start - 1 && progress < this.finish + 1
    if (this.visible) {
      const p = rescale(this.start, this.finish, progress)
      this.position.z = p * Global.settings.sceneDepth

      const shiftY = smoothstep(.25, .75, p)
      this.mesh.position.y = .15 * shiftY * Global.screen.halfBox.y
      this.rocket.position.copy(this.mesh.position)
    }
  }

  onUpdate = ({ seconds }) => {
    this.mesh.rotation.y = seconds * .2
  }

  onResize = () => {
    this.mesh.traverse(child => {
      if (child.isMesh) {
        child.material.uniforms.aspect.value = Global.screen.aspect
      }
    })
  }
}