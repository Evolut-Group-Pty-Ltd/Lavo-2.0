import { overlays } from './data';
import { isMobileLayout } from './utils/layoutTest';
import { setCookie, getCookie } from './utils/Cookies';

export class Overlay {
  constructor({
    onShowOverlay,
    onHideOverlay,
  }) {
    this.initialOverlayOpenned = false;
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

    this.onShowOverlay(this.data.at);
  }

  hide = () => {
    this.$container.classList.remove('show')
    this.shown = false

    this.onHideOverlay()
  }

  template = data => `<p class="header">${data.header}</p>` + data.content.split('\n').reduce((p,c) => p + `<p>${c}</p>`, '')

  updatePointer = ({ x, y }, isOverNav) => {
    if (!isMobileLayout()) {
      this.pointer.x = x
      this.pointer.y = y
      if (this.openButtonShown) {
        this.$openButton.style.left = x + 'px'
        this.$openButton.style.top = y + 'px'
        if (isOverNav) {
          this.$openButton.classList.remove('show')
        } else {
          this.$openButton.classList.add('show')
        }
      }
      if (this.shown) {
        this.$closeButton.style.left = x + 'px'
        this.$closeButton.style.top = y + 'px'
      }
    }
  }

  updateProgress = progress => {
    const rp = Math.round(progress)
    // hiding initial overlay on scroll
    if(this.initialOverlayOpenned && this.data.at == -1 && progress > 0 && progress < 0.1) {
      this.hide();
      setCookie('lavoInitialOverlayShown', 'true', 30);
    }

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

        // showing initial overlay at the very beginning
        if(!this.initialOverlayOpenned & getCookie('lavoInitialOverlayShown') !== 'true' & rp == -1) {
          this.initialOverlayOpenned = true;
          this.show();
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
