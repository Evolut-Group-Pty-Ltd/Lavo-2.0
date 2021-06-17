import { rescale, lerp } from "./utils/interpolations"
import { navSections } from './data'

export class Nav {
  constructor({
    onNavCallback,
  }) {
    this.sections = navSections
    this.onNav = onNavCallback

    this.progressData = []
    Object.keys(this.sections).forEach(name => {
      const data = this.sections[name]
      const progress = data.p
      this.progressData[progress] = {
        section: name,
        sectionStart: progress,
        perc: 0,
        inverse: data.inverse,
        label: data.label,
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
            label: currentData.label,
          }
        }
        currentProgress = i
        currentData = this.progressData[i]
      }
    }
    this.mobileNavExpanded = false

    this.$nav = document.querySelector('.nav')
    this.$sectionProgress = this.$nav.querySelector('.section-progress')
    this.$sectionCurrent = this.$nav.querySelector('.section-current')
    this.$mobileNavOpen = document.querySelector('.mobile-nav.is-closed')
    this.$mobileSectionCurrent = this.$mobileNavOpen.querySelector('.mobile-section-current')
    this.$mobileNavClose = document.querySelector('.mobile-nav.is-opened')
    this.$mobileNavOverlay = document.querySelector('.mobile-nav-overlay')

    this.$nav.querySelectorAll('.nav-link').forEach($link => {
      $link.addEventListener('click', e => {
        const section = e.target.getAttribute('data-section')
        this.onNav(this.sections[section])
        this.collapseMobileNav()
      })
    })

    this.$mobileNavOpen.addEventListener('click', () => {
      this.$nav.classList.add('show')
      this.$mobileNavOverlay.classList.add('show')
      this.$mobileNavOpen.classList.add('hide')
      this.$mobileNavClose.classList.add('show')
      this.mobileNavExpanded = true

      document.querySelector('.products').classList.add('show')
    })

    this.$mobileNavClose.addEventListener('click', () => {
      this.collapseMobileNav()
    })

    this.setActiveSection(this.progressData[0])
  }

  collapseMobileNav = () => {
    this.$nav.classList.remove('show')
    this.$mobileNavOverlay.classList.remove('show')
    this.$mobileNavOpen.classList.remove('hide')
    this.$mobileNavClose.classList.remove('show')
    this.mobileNavExpanded = false
    
    document.querySelector('.products').classList.remove('show')
  }

  setActiveSection = ({ section: name, inverse, label }) => {
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

      this.$mobileSectionCurrent.innerHTML = label
    }
  }

  updateProgress = progress => {
    const p = Math.max(progress, 0)
    const cp = Math.ceil(p)
    const rp = Math.round(p)
    
    const data = this.progressData[rp]
    this.setActiveSection(data)

    let perc = this.progressData[rp].perc
    const nextPerc = this.progressData[cp].perc
    if (rp < cp && cp < this.progressData.length && nextPerc > perc) {
      perc = lerp(perc, nextPerc, p - rp)
    }
    this.$sectionProgress.style.height = perc * 32 + 'px'
  }
}