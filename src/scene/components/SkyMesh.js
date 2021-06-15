import vertexShader from '../materials/sky/vert.glsl'
import fragmentShader from '../materials/sky/frag.glsl'

import { rescale, smoothstep } from "../../utils/interpolations"
import { Global } from "../Global"
import { Group, Euler, ShaderMaterial, Color } from 'three';

export class SkyMesh extends Group {
  
  static defaultRotation = new Euler()

  constructor({
    start,
    finish = start + 1,
    resourceName,
    position,
    rotation = SkyMesh.defaultRotation,
    scale = 1,
  }) {
    super()

    this.mesh = Global.assets.get(resourceName).scene.clone()

    const depth = position.z * Global.settings.sceneDepth
    const bounds = Global.screen.getBoundsByDepth(depth)

    this.mesh.position.set(
      position.x * bounds.y * 1.777, 
      position.y * bounds.y,
      depth,
    )
    this.mesh.rotation.copy(rotation)
    this.mesh.rotation.x += .5 * Math.PI
    this.mesh.scale.setScalar(scale)

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: new Color() },
        map: { value: null },
        opacity: { value: 1 },
        fresnelPower: { value: .25 },
        fogColor: { value: new Color() },
        fogNear: { value: 1 },
        fogFar: { value: 2 },
      },
      vertexShader,
      fragmentShader,
      fog: true,
      transparent: true,
    })
    this.materials = []

    this.mesh.traverse(child => {
      if (child.isMesh) {
        const color = child.material.color
        const map  = child.material.map
        child.material = material.clone()
        child.material.uniforms.color.value = color
        child.material.uniforms.map.value = map
        this.materials.push(child.material)
      }
    })
    this.add(this.mesh)

    this.start = start - .5
    this.finish = finish - .5

    Global.eventBus.on('progress', this.onProgress)
  }
  
  onProgress = progress => {
    this.visible = progress >= this.start - .5 && progress < this.finish + .5
    if (this.visible) {
      const p = rescale(this.start, this.finish, progress)
      this.position.z = p * Global.settings.sceneDepth
      const opacity = smoothstep(1, .5, p)
      this.materials.forEach(m => {
        m.uniforms.opacity.value = opacity
      })
    }
  }
}