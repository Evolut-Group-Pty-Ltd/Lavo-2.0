import { Color } from "three"
import { Global } from "../Global"

// this is actually a sugar class to keep scenario declaration consistent
export class Fog {

  static color0 = new Color()
  static color1 = new Color()
  static scene = null
  static params = []
  static values = []

  static initialize = (scene) => {
    Fog.scene = scene

    Fog.params = Fog.params.sort((a, b) => a.at - b.at)
    const valuesSize = Fog.params[Fog.params.length - 1].at + 1
    let paramIndex = 0
    for (let i = 0; i < valuesSize; i++) {
      if (i > Fog.params[paramIndex].at) {
        paramIndex++
      }
      Fog.values[i] = Fog.params[paramIndex].color
    }
    
    Global.eventBus.on('progress', Fog.onProgress)
  }

  static onProgress = progress => {
    const index = Math.floor(progress)
    const lerpFactor = progress - index

    Fog.color0.setHex(Fog.values[index])
    Fog.color1.setHex(Fog.values[index + 1])
    Fog.color0.lerp(Fog.color1, lerpFactor)

    Fog.scene.background = Fog.color0
    Fog.scene.fog.color = Fog.color0
  }

  constructor({
    at,
    color,
  }) {
    Fog.params.push({ at, color })
  }
}