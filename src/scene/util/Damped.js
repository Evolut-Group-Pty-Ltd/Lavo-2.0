import { Global } from "../Global"

export class Damped {

  static values = {}
  static set = (name, value) => Damped.values[name].target = value
  static get = name => Damped.values[name].value

  constructor(name, value, damping = .02) {
    this.damping = damping
    this.value = value
    this.target = value

    Damped.values[name] = this

    Global.eventBus.on('update', this.onUpdate)
  }

  onUpdate = () => {
    this.value += (this.target - this.value) * this.damping
  }
}