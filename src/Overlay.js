import { overlays } from './data'
import { isMobileLayout } from './utils/layoutTest'

export class Overlay {
  constructor({
    onShowOverlay,
    onHideOverlay,
  }) {
    this.points = []
    overlays.forEach(overlay => {
      this.points[overlay.at] = overlay
    })

    this.$container = document.querySelector('.overlay')
    this.$content = document.querySelector('.overlay-content')

    this.$openButton = document.querySelector('.overlay-open-mobile')
    // this.$openButton.addEventListener('touchend', this.show)
    this.$openButton.addEventListener('click', this.show)

    this.$closeButton = document.querySelector('.overlay-close-mobile')
    // this.$closeButton.addEventListener('touchend', this.hide)
    this.$closeButton.addEventListener('click', this.hide)

    this.openButtonShown = false
    this.shown = false
    this.data = null
    this.pointer = { x: 0, y: 0 }

    this.onShowOverlay = onShowOverlay
    this.onHideOverlay = onHideOverlay
  }

  show = () => {
    this.openButtonShown = false
    this.$openButton.classList.remove('show')

    this.$container.classList.add('show')
    this.$container.style.background = this.data.background
    this.shown = true
    this.$content.innerHTML = this.template(this.data)

    if (!isMobileLayout()) {
      this.$closeButton.style.left = this.pointer.x + 'px'
      this.$closeButton.style.top = this.pointer.y + 'px'
    }

    this.onShowOverlay()
  }

  hide = () => {
    this.$container.classList.remove('show')
    this.shown = false

    this.onHideOverlay()
  }

  template = data => `<p class="header">${data.header}</p>` + data.content.split('\n').reduce((p,c) => p + `<p>${c}</p>`, '')

  updatePointer = ({ x ,y }) => {
    if (!isMobileLayout()) {
      this.pointer.x = x
      this.pointer.y = y
      if (this.openButtonShown) {
        this.$openButton.style.left = x + 'px'
        this.$openButton.style.top = y + 'px'
      }
      if (this.shown) {
        this.$closeButton.style.left = x + 'px'
        this.$closeButton.style.top = y + 'px'
      }
    }
  }

  updateProgress = progress => {
    const rp = Math.round(progress)
    if (Math.abs(progress - rp) <= .25 && this.points[rp] !== undefined) {
      this.data = this.points[rp]
      if (!this.openButtonShown && !this.shown) {
        this.openButtonShown = true
        this.$openButton.classList.add('show')
        this.$openButton.classList.add('transparent')
        setTimeout(() => this.$openButton.classList.remove('transparent'), 0)
        if (!isMobileLayout()) {
          this.$openButton.style.left = this.pointer.x + 'px'
          this.$openButton.style.top = this.pointer.y + 'px'
        }
      }
    } else if (this.openButtonShown) {
      this.openButtonShown = false
      this.$openButton.classList.add('transparent')
      setTimeout(() => {
        this.$openButton.classList.remove('show')
        this.$openButton.classList.remove('transparent')
      }, 250)
    }
  }
}