import { ResourceManager } from "./ResourceManager";
import { RenderingPipeline } from "./postprocessing/RenderingPipeline";
import { Fog, PerspectiveCamera, Scene } from "three";
import { Screen } from "./util/Screen";
import { Scenario } from "./Scenario";
import { Global } from "./Global";
import { Damped } from "../utils/Damped";

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

    this.camera = new PerspectiveCamera(5, Global.screen.aspect, 10, Global.settings.sceneDepth * 2)
    this.camera.position.set(0, 0, Global.settings.sceneDepth)
    this.camera.lookAt(0, 0, 0)

    this.scene = new Scene()
    this.scene.fog = new Fog(0, Global.settings.fogStart, Global.settings.sceneDepth)

    this.scenario = new Scenario(this)

    Global.eventBus.dispatch('progress', 0)

    new Damped('pointerX', 0, .1)
    new Damped('pointerY', 0, .1)
  }

  updatePointer = ({ mouse: pointer }) => {
    Damped.set('pointerX', pointer.x / Global.screen.x * 2 - 1)
    Damped.set('pointerY', 1 - pointer.y / Global.screen.y * 2)
  }

  updateProgress = progress => {
    Global.eventBus.dispatch('progress', progress)
  }

  prevTime = 0
  onFrame = time => {

    const dt = Math.min(1e3 / 30, time - this.prevTime)
    this.prevTime = time

    Global.eventBus.dispatch('update', { time, dt, seconds: time * 1e-3, ds: dt * 1e-3 })

    const pointer = {
      x: Damped.get('pointerX'),
      y: Damped.get('pointerY'),
    }
    Global.eventBus.dispatch('pointer', pointer)

    this.camera.position.x = pointer.x * 2.5
    this.camera.position.y = pointer.y * 2.5
    this.camera.lookAt(0, 0, 0)

    Global.eventBus.dispatch('render', this)
  }

  onResize = resolution => {
    this.camera.aspect = resolution.aspect
    this.camera.updateProjectionMatrix()
  }
}