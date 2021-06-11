import { rescale } from "../../utils/interpolations"
import { Global } from "../Global"
import { Group, Vector3, MeshBasicMaterial, Euler } from "three";

export class TrivialMesh extends Group {
  constructor({
    start,
    finish = start + 1,
    resourceName,
    position,
    scale = 1,
  }) {
    super()

    this.mesh = Global.assets.get(resourceName).scene.clone()
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

    this.start = start - .5
    this.finish = finish - .5

    this.position.set(
      position.x * Global.screen.halfBox.x, 
      position.y * Global.screen.halfBox.y,
      position.z * Global.settings.sceneDepth,
    )
    this.rotation.x = .5 * Math.PI
    
    Global.eventBus.on('progress', this.onProgress)
  }
  
  onProgress = progress => {
    this.visible = progress > this.start - 1 && progress < this.finish + 1
    if (this.visible) {
      const p = rescale(this.start, this.finish, progress)
      this.position.z = p * Global.settings.sceneDepth
    }
  }
}