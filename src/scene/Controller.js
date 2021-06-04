import { ResourceManager } from "./ResourceManager";
import { RenderingPipeline } from "./postprocessing/RenderingPipeline";
import { Fog, PerspectiveCamera, Scene } from "three";
import { Screen } from "./util/Screen";
import { Scenario } from "./Scenario";
import { Global } from "./Global";
import { Damped } from "./util/Damped";

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

    new Damped('progress', 0, .02)
    new Damped('pointerX', 0, .1)
    new Damped('pointerY', 0, .1)
  }

  start = () => {
    requestAnimationFrame(this.tick)
    Global.eventBus.dispatch('progress', 0)
  }

  updatePointer = ({ mouse: pointer }) => {

    Damped.set('pointerX', pointer.x / Global.screen.x * 2 - 1)
    Damped.set('pointerY', 1 - pointer.y / Global.screen.y * 2)
  }

  updateProgress = progress => {
    Damped.set('progress', progress)
  }

  prevTime = 0
  tick = time => {

    const dt = Math.min(1e3 / 30, time - this.prevTime)

    Global.eventBus.dispatch('update', { time, dt, seconds: time * 1e-3 })

    Global.eventBus.dispatch('progress', Damped.get('progress'))
    const pointer = {
      x: Damped.get('pointerX'),
      y: Damped.get('pointerY'),
    }
    Global.eventBus.dispatch('pointer', pointer)

    this.camera.position.x = pointer.x * 2.5
    this.camera.position.y = pointer.y * 2.5
    this.camera.lookAt(0, 0, 0)

    Global.eventBus.dispatch('render', this)

    requestAnimationFrame(this.tick)
  }

  onResize = resolution => {
    this.camera.aspect = resolution.aspect
    this.camera.updateProjectionMatrix()
  }
}