import vertexShader from '../materials/fresnelBasic/vert.glsl'
import fragmentShader from '../materials/fresnelBasic/frag.glsl'

import { rescale } from "../../utils/interpolations"
import { Global } from "../Global"
import { Group, Vector3, ShaderMaterial, Euler, Color } from "three";

export class SpinningMesh extends Group {

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

    this.mesh.position.set(
      position.x * Global.screen.halfBox.x, 
      position.y * Global.screen.halfBox.y,
      position.z * Global.settings.sceneDepth,
    )
    this.mesh.rotation.copy(rotation)
    this.mesh.rotation.order = 'XZY'
    this.mesh.scale.setScalar(scale)

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: null },
        map: { value: null },
        fresnelPower: { value: .25 },
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
        material.uniforms.color.value = child.material.color
        material.uniforms.map.value = child.material.map
        child.material = material.clone()
      }
    })
    this.add(this.mesh)

    this.ry = rotation.y
    this.start = start - .5
    this.finish = finish - .5

    Global.eventBus.on('update', this.onUpdate)
    Global.eventBus.on('progress', this.onProgress)
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
}