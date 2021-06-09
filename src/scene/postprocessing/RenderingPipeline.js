import { ACESFilmicToneMapping, sRGBEncoding, WebGL1Renderer } from "three"
import { Global } from "../Global"

export class RenderingPipeline {
  constructor(container) {

    this.renderer = new WebGL1Renderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.resize()
    
    this.renderer.outputEncoding = sRGBEncoding
    // this.renderer.toneMapping = ACESFilmicToneMapping
    // this.renderer.toneMappingExposure = 1

    container.appendChild(this.renderer.domElement)

    Global.eventBus.on('resize', this.resize)
    Global.eventBus.on('render', this.render)
  }
  
  resize = () => {
    this.renderer.setSize(Global.screen.x, Global.screen.y)
  }

  render = ({ scene, camera }) => {
    this.renderer.render(scene, camera)
  }
}