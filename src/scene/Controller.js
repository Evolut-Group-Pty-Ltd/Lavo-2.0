import { ResourceManager } from "./ResourceManager";
import { RenderingPipeline } from "./postprocessing/RenderingPipeline";
import { Fog, PerspectiveCamera, Scene } from "three";
import { Screen } from "./util/Screen";
import { Scenario } from "./Scenario";
import { Global } from "./Global";

export class Controller {

  constructor({
    paths,
  }) {
    this.eventBus = Global.eventBus
    Global.assets = new ResourceManager(paths)
  }

  load = () => {
    Global.assets.load()
  }

  create = ({ container }) => {
    Global.screen = new Screen(container)
    Global.eventBus.on('resize', this.onResize)

    this.renderPipe = new RenderingPipeline(container)

    this.camera = new PerspectiveCamera(5, Global.screen.aspect, 10, 1e3)
    this.camera.position.set(0, 0, Global.settings.sceneDepth)
    this.camera.lookAt(0, 0, 0)

    this.scene = new Scene()
    this.scene.fog = new Fog(0, Global.settings.fogStart, Global.settings.sceneDepth)

    this.scenario = new Scenario(this)

    this.pointer = {
      x: .5,
      y: .5,
    }
  }

  start = () => {
    requestAnimationFrame(this.tick)

    Global.eventBus.dispatch('progress', 11)
  }

  update = ({ mouse }) => {
    this.pointer.x = mouse.x / Global.screen.x * 2 - 1
    this.pointer.y = 1 - mouse.y / Global.screen.y * 2

    // Global.eventBus.dispatch('progress', (this.pointer.x + 1) * .5 * 27 - .5 )
    // Global.eventBus.dispatch('progress', this.pointer.x + 12 - .5)

    Global.eventBus.dispatch('pointer', this.pointer)

    this.camera.rotation.x =  this.pointer.y * 25e-4
    this.camera.rotation.y = -this.pointer.x * 25e-4
  }

  prevTime = 0
  tick = time => {
    Global.eventBus.dispatch('progress', (time * 3e-4) % 27 - .5 )

    const dt = Math.min(1e3 / 30, time - this.prevTime)

    Global.eventBus.dispatch('update', { time, dt, seconds: time * 1e-3 })
    Global.eventBus.dispatch('render', this)

    requestAnimationFrame(this.tick)
  }

  onResize = resolution => {
    this.camera.aspect = resolution.aspect
    this.camera.updateProjectionMatrix()
  }
}