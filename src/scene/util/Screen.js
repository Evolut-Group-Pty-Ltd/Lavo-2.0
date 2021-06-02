import { Vector2, Vector4 } from "three"
import { Global } from "../Global"

export class Screen {
  constructor(container) {
    this.container = container

    this.update()

    window.addEventListener('resize', this.debounceResize)
  }

  v2 = new Vector2()
  v4 = new Vector4()
  debounce = null

  debounceResize = () => {
    if (this.debounce !== null) {
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(this.update, 333)
  }

  update = () => {
    this.debounce = null

    this.x = this.v2.x = this.v4.x = this.container.clientWidth
    this.y = this.v2.y = this.v4.y = this.container.clientHeight
    this.aspect = this.x / this.y
    this.v4.z = 1 / this.x
    this.v4.w = 1 / this.y

    Global.eventBus.dispatch('resize', this)
  }
}