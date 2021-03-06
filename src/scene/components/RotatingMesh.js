import { rescale } from "../../utils/interpolations"
import { Global } from "../Global"
import { Group, Vector3, MeshBasicMaterial, Euler } from "three";

export class RotatingMesh extends Group {

  static defaultPosition = new Vector3()
  static defaultRotation = new Euler()

  constructor({
    start,
    finish = start + 1,
    resourceName,
    position = RotatingMesh.defaultPosition,
    meshRotation = RotatingMesh.defaultRotation,
    scale = 1,
    biasRotation = 0,
    finalRotation = 2 * Math.PI,
    rotateAxis = 'y',
  }) {
    super()

    this.mesh = Global.assets.get(resourceName).scene.clone()
    this.mesh.position.copy(position)
    this.mesh.rotation.copy(meshRotation)
    this.mesh.scale.setScalar(scale)
    
    this.mesh.traverse(child => {
      if (child.isMesh) {
        child.material = new MeshBasicMaterial({
          color: child.material.color,
          map: child.material.map,
        })
      }
    })
    this.add(this.mesh)

    this.biasRotation = biasRotation
    this.finalRotation = finalRotation
    this.start = start - .5
    this.finish = finish - .5
    this.rotateAxis = rotateAxis

    Global.eventBus.on('update', this.onUpdate)
    Global.eventBus.on('progress', this.onProgress)
  }
  
  onProgress = progress => {
    this.visible = progress > this.start - 1 && progress < this.finish + 1
    if (this.visible) {
      const p = rescale(this.start, this.finish, progress)
      this.position.z = p * Global.settings.sceneDepth
      this.rotation.z = p * this.finalRotation + this.biasRotation
    }
  }

  onUpdate = ({ seconds }) => {
    this.mesh.rotation[this.rotateAxis] = seconds
  }
}