import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { RawShaderMaterial, Color, Mesh, Vector3 } from "three"
import { smoothstep, hold } from "../../../utils/interpolations"
import { Global } from "../../Global"
import { TextGeometry } from './BMFontText'

const buffer = new Vector3()

const getGeometryWidth = () => {
  const textBounds = Global.screen.getBoundsByDepth(Global.settings.sceneDepth * .5)
  const maxWidth = textBounds.x * 4 / 35 * 600
  return Math.min(600, maxWidth)
}

const createTextGeometry = ({ width, font, message }) => {

  return new TextGeometry({
    width,
    align: 'center',
    font,
    text: message,
    flipY: true,
  })
}

export class Text extends Mesh {

  static defaultFont = null
  static white = new Color()

  constructor({
    start,
    bias = .125,
    finish = start + 1,
    message,
    font = Text.defaultFont.font,
    fontMap = Text.defaultFont.map,
    color = Text.white,
    spaceGradient = false,
    mobileY = 0,
  }) {
    const width = getGeometryWidth()
    const geometry = createTextGeometry({ width, font, message })

    super(
      geometry,
      new RawShaderMaterial({
        defines: {
          spaceGradient: spaceGradient ? 1 : 0,
        },
        uniforms: {
          map: { value: fontMap },
          opacity: { value: 1 },
          color: { value: color },
          aspect: { value: Global.screen.aspect },
          fogColor: { value: new Color() },
          fogNear: { value: 1 },
          fogFar: { value: 2 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        fog: true,
      }),
    )
    
    this.fitGeometry()

    this.font = font
    this.message = message
    this.prevWidth = width
    this.rotation.x = Math.PI
    this.scale.setScalar(.05)
    this.visible = false
    
    this.bias = bias
    this.start = start - bias - .5
    this.finish = finish + bias - .5
    this.color = color
    this.mobileY = mobileY
    
    this.updateY()

    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('resize', this.onResize)
  }

  updateY = () => {
    if (Global.screen.mobileLayout) {
      this.position.y = this.mobileY * Global.screen.halfBox.y * .5
    } else {
      this.position.y = 0
    }
  }

  fitGeometry = () => {
    this.geometry.computeBoundingBox()
    this.geometry.boundingBox.getCenter(buffer)
    const a = this.geometry.attributes.position.array
    for (let i = 0; i < a.length; i += 2) {
      a[i] -= buffer.x
      a[i + 1] -= buffer.y
    }
  }
  
  onProgress = progress => {
    if (progress < this.start || progress > this.finish) {
      this.visible = false
    } else {
      this.visible = true
      const p = hold(
        this.start, this.start + .5 + this.bias,
        this.finish - .5 - this.bias, this.finish,
        progress
      )
      this.position.z = p * Global.settings.sceneDepth
      this.material.uniforms.opacity.value = smoothstep(1, .9, p)
    }
  }

  onResize = () => {
    this.material.uniforms.aspect.value = Global.screen.aspect

    const width = getGeometryWidth()

    if (this.prevWidth != width) {
      this.geometry.dispose()
      const geometry = createTextGeometry({
        width,
        font: this.font,
        message: this.message,
      })
      this.geometry = geometry
      this.fitGeometry()
      this.prevWidth = width
    }

    this.updateY()
  }
}