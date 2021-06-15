import { EventDispatcher } from "./EventDispatcher"

const NONE = 0
const SWIPE = 1
const PINCH = 2

export class Gestures extends EventDispatcher {
  /** @param {Node} domElement */
  constructor(domElement) {
    super()

    this.$dom = domElement

    const options = { capture: true, passive: false }
    this.$dom.addEventListener('touchstart', this.onTouchStart, options)
    this.$dom.addEventListener('touchmove', this.onTouchMove, options)
    this.$dom.addEventListener('touchend', this.onTouchEnd, options)

    this.currentAction = NONE

    this.swipeStart = { x: 0, y: 0 }
    this.pinchStart = 1
  }

  onTouchStart = e => {
    this.noApple(e)

    this.currentAction = NONE
    
    if (e.touches.length == 1) {
      this.swipeStart.x = e.touches[0].clientX
      this.swipeStart.y = e.touches[0].clientY
      this.currentAction = SWIPE
      this.dispatch('swipestart', {
        start: this.swipeStart,
        e,
      })
    } 
    
    if (e.touches.length > 1) {
      this.pinchStart = this.getPinch(e.touches)
      this.currentAction = PINCH
      this.dispatch('pinchstart', {
        start: this.pinchStart,
        e,
      })
    }
  }

  onTouchMove = e => {
    this.noApple(e)

    if (this.currentAction == SWIPE && e.touches.length == 1) {
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      this.dispatch('swipe', {
        start: this.swipeStart,
        end: { x, y },
        e,
      })
    }
    if (this.currentAction == PINCH && e.touches.length > 1) {
      const pinch = this.getPinch(e.touches)
      this.dispatch('pinch', {
        start: this.pinchStart,
        end: pinch,
        zoom: pinch / this.pinchStart,
        e,
      })
    }
  }

  onTouchEnd = e => {
    this.noApple(e)
    
    if (this.currentAction == SWIPE) {
      this.dispatch('swipefinish', {
        e,
      })
    }
    if (this.currentAction == PINCH) {
      this.dispatch('pinchfinish', {
        e,
      })
    }
    this.currentAction = NONE
  }

  getPinch = touches => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  noApple = event => {
    if (event.scale != undefined && event.scale !== 1) {
      event.preventDefault()
    }
  }
}