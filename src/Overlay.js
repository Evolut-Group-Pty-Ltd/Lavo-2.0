export class Overlay {
  constructor({
    overlays,
  }) {
    this.points = []
    overlays.forEach(overlay => {
      this.points[overlay.at] = overlay
    })

    this.$container = document.querySelector('.overlay')
    this.$content = document.querySelector('.overlay-content')

    this.shown = false
  }

  template = data => `<p class="header">${data.header}</p>` + data.content.split('\n').reduce((p,c) => p + `<p>${c}</p>`, '')

  updateProgress = progress => {
    return
    const rp = Math.round(progress)
    if (this.points[rp] !== undefined) {
      const data = this.points[rp]
      if (!this.shown) {
        this.$container.classList.add('show')
        this.$container.style.background = data.background
        this.shown = true
        this.$content.innerHTML = this.template(data)
      }
    } else if (this.shown) {
      this.$container.classList.remove('show')
      this.shown = false
    }
  }
}