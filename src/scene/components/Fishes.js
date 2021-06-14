import vertexShader from '../materials/sky/vert.glsl'
import fragmentShader from '../materials/sky/frag.glsl'

import { rescale } from "../../utils/interpolations"
import { Global } from "../Global"
import { Group, Vector3, ShaderMaterial, Color } from "three";

const v3 = new Vector3()

export class Fishes extends Group {
  constructor({
    start,
    finish = start + 1,
    fishNames,
    count = 7,
    scale = 1,
  }) {
    super()

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: new Color() },
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
      transparent: true,
    })
    this.materials = []

    this.fishes = []

    for (let i = 0; i < count; i++) {

      const theta = Math.atan2(Math.random() - .5, Math.random() - .5)

      const resourceName = fishNames[Math.floor(Math.random() * fishNames.length)]

      const mesh = Global.assets.get(resourceName).scene.clone()

      const depth = Math.random() * .5 * Global.settings.sceneDepth
      const bounds = Global.screen.getBoundsByDepth(depth)
      mesh.position.set(
        (Math.random() * 2 - 1) * bounds.x, 
        (Math.random() * 2 - 1) * bounds.y,
        depth,
      )
      mesh.rotation.set(Math.PI * .5 + Math.random() * 1 - .5, theta + Math.PI * .5, 0)
      if (resourceName == 'jellyfish') {
        mesh.scale.setScalar(scale * .4)
      } else {
        mesh.scale.setScalar(scale)
      }
    
      mesh.traverse(child => {
        if (child.isMesh) {
          material.uniforms.color.value = child.material.color
          material.uniforms.map.value = child.material.map
          child.material = material.clone()
          this.materials.push(child.material)
        }
      })
      this.add(mesh)

      this.fishes.push({
        mesh,
        theta,
        thetaAmp: .5 * Math.random(),
        speed: 2 + 5 * Math.random(),
      })
    }

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
    const boundX = Global.screen.halfBox.x
    const boundY = Global.screen.halfBox.y
    const wX = Global.screen.box.x
    const wY = Global.screen.box.y
    this.fishes.forEach(fish => {
      const theta = fish.theta + Math.sin(seconds) * fish.thetaAmp
      v3.x = Math.cos(theta) * ds * fish.speed
      v3.y = Math.sin(theta) * ds * fish.speed
      fish.mesh.position.add(v3)
      fish.mesh.rotation.y = theta + Math.PI * .5

      if (fish.mesh.position.x > boundX) {
        fish.mesh.position.x -= wX
      }
      if (fish.mesh.position.x < -boundX) {
        fish.mesh.position.x += wX
      }
      if (fish.mesh.position.y > boundY) {
        fish.mesh.position.y -= wY
      }
      if (fish.mesh.position.y < -boundY) {
        fish.mesh.position.y += wY
      }
    })
  }
}