import vertexShader from '../materials/space/vert.glsl'
import fragmentShader from '../materials/space/frag.glsl'

import { rescale } from "../../utils/interpolations"
import { Global } from "../Global"
import { Group, Vector3, ShaderMaterial, Euler, Color } from "three";

export class Hydrogen extends Group {

  static defaultPosition = new Vector3()
  static defaultRotation = new Euler()

  constructor({
    start,
    finish = start + 1,
    resourceName,
    position = SpinningMesh.defaultPosition,
    rotation = SpinningMesh.defaultRotation,
    scale = 1,
  }) {
    super()

    this.mesh = Global.assets.get(resourceName).scene.clone()

    const depth = position.z * Global.settings.sceneDepth
    const bounds = Global.screen.getBoundsByDepth(depth)

    this.mesh.position.set(
      position.x * bounds.x, 
      position.y * bounds.y,
      depth,
    )
    this.mesh.rotation.copy(rotation)
    this.mesh.rotation.order = 'XZY'
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

    this.ry = rotation.y
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
    }
  }

  onUpdate = ({ seconds }) => {
    this.mesh.rotation.y = seconds + this.ry
  }

  onResize = () => {
    this.mesh.traverse(child => {
      if (child.isMesh) {
        child.material.uniforms.aspect.value = Global.screen.aspect
      }
    })
  }
}