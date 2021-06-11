import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { RawShaderMaterial, Color, Mesh, Vector3 } from "three"
import { smoothstep, hold } from "../../../utils/interpolations"
import { Global } from "../../Global"
import { TextGeometry } from './BMFontText'

const buffer = new Vector3()

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
  }) {
    super(
      new TextGeometry({
        width: 600,
        align: 'center',
        font,
        text: message,
        flipY: true,
      }),
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
    
    this.geometry.computeBoundingBox()
    this.geometry.boundingBox.getCenter(buffer)
    const a = this.geometry.attributes.position.array
    for (let i = 0; i < a.length; i += 2) {
      a[i] -= buffer.x
      a[i + 1] -= buffer.y
    }

    this.rotation.x = Math.PI
    this.scale.setScalar(.05)
    this.visible = false
    
    this.bias = bias
    this.start = start - bias - .5
    this.finish = finish + bias - .5
    this.color = color

    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('resize', this.onResize)
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
  }
}