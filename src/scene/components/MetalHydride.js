import vertexShader from '../materials/sky/vert.glsl'
import fragmentShader from '../materials/sky/frag.glsl'

import { Group, Color, BoxBufferGeometry, ShaderMaterial } from "three";
import { Global } from "../Global";
import { rescale } from '../../utils/interpolations';

export class MetalHydride extends Group {
  constructor({
    start,
    finish = start + 1,
    resourceName = 'hydride',
    position,
    scale = 1,
  }) {
    super()

    this.mesh = Global.assets.get(resourceName).scene.clone()
    this.mesh.scale.setScalar(scale)

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: new Color(0xC9D4DE) },
        map: { value: null },
        opacity: { value: 1 },
        fresnelPower: { value: 1 },
        fogColor: { value: new Color() },
        fogNear: { value: 1 },
        fogFar: { value: 2 },
      },
      vertexShader,
      fragmentShader,
      fog: true,
      // transparent: true,
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

    const depth = position.z * Global.settings.sceneDepth
    const bounds = Global.screen.getBoundsByDepth(depth)

    this.position.set(
      position.x * bounds.x, 
      position.y * bounds.y,
      depth,
    )

    this.start = start - .5
    this.finish = finish - .5

    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('update', this.onUpdate)
  }

  onProgress = progress => {
    this.visible = progress > this.start - 1 && progress < this.finish + 1
    if (this.visible) {
      const p = rescale(this.start, this.finish, progress)
      this.position.z = p * Global.settings.sceneDepth
    }
  }

  onUpdate = ({ seconds }) => {
    this.rotation.x = seconds * .5
    this.rotation.z = seconds * .2
  }
}