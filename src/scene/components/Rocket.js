import vertexShader from '../materials/fresnelBasic/vert.glsl'
import fragmentShader from '../materials/fresnelBasic/frag.glsl'

import { rescale } from "../../utils/interpolations"
import { Global } from "../Global"
import { Group, Vector3, ShaderMaterial, Color } from "three";

export class Rocket extends Group {
  constructor({
    start,
    finish = start + 1,
    position,
    resourceName,
    scale = 1,
  }) {
    super()

    this.mesh = Global.assets.get(resourceName).scene.clone()
    this.mesh.position.set(
      position.x * Global.screen.halfBox.x, 
      position.y * Global.screen.halfBox.y,
      position.z * Global.settings.sceneDepth,
    )
    this.mesh.rotation.reorder('XZY')
    this.mesh.rotation.z = Math.PI * -.25
    this.mesh.scale.setScalar(scale)

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: new Vector3(3, 3, 3) }, // maybe looks like a crutch, but for shader this is ok
        map: { value: null },
        fresnelPower: { value: .75 },
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
        // material.uniforms.color.value = child.material.color
        material.uniforms.map.value = child.material.map
        child.material = material.clone()
      }
    })
    this.add(this.mesh)

    this.initialPosition = position
    this.speed = 15
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

  onUpdate = ({ seconds, ds }) => {

    this.mesh.position.x += ds * this.speed * Global.screen.aspect
    this.mesh.position.y += ds * this.speed
    this.mesh.rotation.y = seconds

    const boundX = Global.screen.halfBox.x
    const boundY = Global.screen.halfBox.y
    if (
      this.mesh.position.x > boundX ||
      this.mesh.position.x < -boundX ||
      this.mesh.position.y > boundY ||
      this.mesh.position.y < -boundY
    ) {
      this.mesh.position.set(
        this.initialPosition.x * Global.screen.halfBox.x, 
        this.initialPosition.y * Global.screen.halfBox.y,
        this.initialPosition.z * Global.settings.sceneDepth,
      )
    }
  }
}