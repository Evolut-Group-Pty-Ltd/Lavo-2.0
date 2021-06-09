export class Damped {

  static values = {}
  static set = (name, value) => Damped.values[name].target = value
  static get = name => Damped.values[name].value
  static update = () => Object.keys(Damped.values).forEach(name => Damped.values[name].update())

  constructor(name, value, damping = .02) {
    this.damping = damping
    this.value = value
    this.target = value

    Damped.values[name] = this
  }

  update = () => {
    this.value += (this.target - this.value) * this.damping
  }
}