import { Mesh, MeshBasicMaterial, TextGeometry } from "three"
import { rescale, smoothstep } from "../util/interpolations"
import { Color } from "three"
import { Global } from "../Global"

export class Text extends Mesh {

  static defaultFont = null
  static white = new Color()

  constructor({
    start,
    finish = start + 1.25,
    message,
    font = Text.defaultFont,
    color = Text.white
  }) {
    super(
      new TextGeometry(message, {
        font,
        size: 1,
        height: .1,
        curveSegments: 4,
        bevelEnabled: false,
      }),
      new MeshBasicMaterial({
        color,
        transparent: true,
      }),
    )
    
    this.geometry.computeBoundingBox()
    this.geometry.center()

    this.visible = false

    this.start = start - .5
    this.finish = finish - .5
    this.color = color

    Global.eventBus.on('progress', this.onProgress)
  }
  
  onProgress = progress => {
    if (progress < this.start || progress > this.finish) {
      this.visible = false
    } else {
      this.visible = true
      const p = rescale(this.start, this.finish, progress)
      this.position.z = p * Global.settings.sceneDepth
      this.material.opacity = smoothstep(1, .9, p)
    }
  }
}