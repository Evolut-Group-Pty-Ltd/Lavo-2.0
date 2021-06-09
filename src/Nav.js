import { rescale, lerp } from "./utils/interpolations"

export class Nav {
  constructor({
    sections,
    onNavCallback,
  }) {
    this.sections = sections
    this.onNav = onNavCallback

    this.progressData = []
    Object.keys(sections).forEach(name => {
      const data = sections[name]
      let progress, inverse = false
      if (typeof data == "number") {
        progress = data
      } else {
        progress = data.p
        inverse = data.inverse
      }
      this.progressData[progress] = {
        section: name,
        sectionStart: progress,
        perc: 0,
        inverse,
      }
    })
    let currentData = this.progressData[0]
    let currentProgress = 0
    for (let i = 1; i < this.progressData.length; i++) {
      if (this.progressData[i] && this.progressData[i].section != currentData) {
        for (let j = currentProgress + 1; j < i; j++) {
          this.progressData[j] = {
            section: currentData.section,
            sectionStart: currentProgress,
            perc: rescale(currentProgress, i, j),
            inverse: currentData.inverse,
          }
        }
        currentProgress = i
        currentData = this.progressData[i]
      }
    }

    this.$nav = document.querySelector('.right-nav')
    this.$sectionProgress = this.$nav.querySelector(`.section-progress`)
    this.$sectionCurrent = this.$nav.querySelector(`.section-current`)

    this.$nav.querySelectorAll('.nav-link').forEach($link => {
      $link.addEventListener('click', e => {
        const section = e.target.getAttribute('data-section')
        this.onNav(this.sections[section])
      })
    })

    this.setActiveSection(this.progressData[0])
  }

  setActiveSection = ({ section: name, inverse }) => {
    if (name != this.activeSection) {
      if (this.activeSection) {
        this.$nav.querySelector(`.nav-link[data-section="${this.activeSection}"`).classList.remove('active')
      }
      this.activeSection = name
      const link = this.$nav.querySelector(`.nav-link[data-section="${this.activeSection}"`)
      link.classList.add('active')
      this.$sectionCurrent.style.top = link.offsetTop + 7.5 + 'px'

      if (inverse) {
        document.body.classList.add('inverse')
      } else {
        document.body.classList.remove('inverse')
      }
    }
  }

  updateProgress = progress => {
    const cp = Math.ceil(progress)
    const rp = Math.round(progress)
    
    const data = this.progressData[rp]
    this.setActiveSection(data)

    let perc = this.progressData[rp].perc
    const nextPerc = this.progressData[cp].perc
    if (rp < cp && cp < this.progressData.length && nextPerc > perc) {
      perc = lerp(perc, nextPerc, progress - rp)
    }
    this.$sectionProgress.style.height = perc * 32 + 'px'
  }
}