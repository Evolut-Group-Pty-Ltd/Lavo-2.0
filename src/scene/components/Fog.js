import { Color } from "three"
import { Global } from "../Global"
import { rescale } from "../util/interpolations"

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
    // assuming fog is explicitly declared in scenario on the last index
    const valuesSize = Fog.params[Fog.params.length - 1].at + 1
    let paramIndex = 0
    for (let i = 0; i < valuesSize; i++) {
      if (i > Fog.params[paramIndex].at) {
        paramIndex++
      }
      Fog.color0.setHex(Fog.params[paramIndex].color)
      if (paramIndex > 0) {
        Fog.color1.setHex(Fog.params[paramIndex - 1].color)
        // interpolating backward is a bit awkward, but it works
        Fog.color0.lerp(Fog.color1, rescale(Fog.params[paramIndex].at, Fog.params[paramIndex - 1].at, i))
      }
      Fog.values[i] = Fog.color0.getHex()
    }
    
    Global.eventBus.on('progress', Fog.onProgress)
  }

  static onProgress = progress => {
    const index = Math.max(0, Math.floor(progress))
    
    Fog.color0.setHex(Fog.values[index])
    
    if (index < Fog.values.length - 1) {
      const lerpFactor = progress - index
      Fog.color1.setHex(Fog.values[index + 1])
      Fog.color0.lerp(Fog.color1, lerpFactor)
    }

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