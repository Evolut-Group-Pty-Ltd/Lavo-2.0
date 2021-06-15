export class LearnMore {
  $ = document.querySelector('.learn-more')
  width = 200
  shown = false
  hideTO = -1

  updateProgress = progress => {
    if (progress >= 26.75) {
      if (!this.shown) {
        clearTimeout(this.hideTO)
        this.shown = true
        setTimeout(() => {
          this.$.style.opacity = 1
          this.width = this.$.clientWidth
          console.log("LearnMore -> this.width", this.width)
        }, 0)
        this.$.classList.add('show')
      }
    } else if (this.shown) {
      this.shown = false
      this.$.style.opacity = 0
      this.hideTO = setTimeout(() => this.$.classList.remove('show'), 500)
    }
  }

  updatePointer = ({ x , y }) => {
    const tx = (window.innerWidth * .5 - x) * .05 - this.width * .5
    const ty = (window.innerHeight * .5 - y) * .05
    this.$.style.transform = `translate(${tx}px, ${ty}px)`
  }
}