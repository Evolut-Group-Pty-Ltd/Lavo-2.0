export class EventDispatcher {
  constructor() {
    this.__listeners = {}
  }

  on = (type, callback) => {
    if (!this.__listeners[type]) {
      this.__listeners[type] = []
    }
    this.__listeners[type].push(callback)
  }

  dispatch = (type, data) => {
    // if (type == 'resize') {
    //   console.log('breakpoint me')
    // }
    if (this.__listeners[type]) {
      this.__listeners[type].forEach(callback => callback(data))
    }
  }
  
}