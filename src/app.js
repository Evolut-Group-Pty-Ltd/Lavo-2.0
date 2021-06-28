import './style/site.css'

import { Controller as GLController } from "./scene/Controller";
import { normalizeWheelDelta } from "./utils/normalizeWheelDelta";
import { Nav } from "./Nav";
import { Damped } from './utils/Damped';
import { Overlay } from './Overlay';
import { LearnMore } from './LearnMore';
import { Gestures } from './utils/Gestures';

// window.dataLayer = window.dataLayer || [];
// export function gtag(a) {
//   dataLayer.push(a)
// }

function reveal(domNode) {
  domNode.classList.remove('hide')
  setTimeout(() => domNode.classList.remove('transparent'), 0)
}
const isIOS = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

const startFrom = -1
const scrollToProgress = .005
const maxScroll = 27 / scrollToProgress
let scrollPosition = startFrom / scrollToProgress, animFrame
let gtagScreen = Number.MIN_SAFE_INTEGER

new Damped('progress', startFrom, .02)

const $loadingProgress = document.querySelector('.loading-progress')
const $centralLogo = document.querySelector('.central-logo')
let isFastForwarding = false

const gl = new GLController()

// gl.eventBus.on('loading.error', ({url}) => {
//   console.log(`Error while loading ${url}!`)
// })

gl.eventBus.on('loading.progress', ({ loaded, total }) => {
  const p = loaded / total
  $loadingProgress.innerHTML = `${p * 100 | 0}%`
  document.querySelector('#loading-progress-bar').style.height = (p * 75 + 5) + 'px'
})

const onLoadingComlete = () => {
  
  let ignoreInput = false

  const nav = new Nav({
    onNavCallback: (sectionData) => {
      let progress = sectionData.p
      updateScrollPosition(progress / scrollToProgress, true)
    },
  })

  const overlay = new Overlay({
    onShowOverlay: () => {
      ignoreInput = true
      const event = `Screen ${gtagScreen + 4}a`
      gtag({ event })
    },
    onHideOverlay: () => { ignoreInput = false },
  })

  const learnMore = new LearnMore()

  const gestures = new Gestures(document.body)

  const onFrame = time => {
    Damped.update()

    const progress = Damped.get('progress')
    gl.updateProgress(progress)
    nav.updateProgress(progress)
    overlay.updateProgress(progress)
    learnMore.updateProgress(progress)

    gl.onFrame(time)
    
    if (gtagScreen != Math.round(progress)) {
      gtagScreen = Math.round(progress)
      const event = `Screen ${gtagScreen + 4}`
      gtag({ event })
    }

    animFrame = requestAnimationFrame(onFrame)
  }

  const updateScrollPosition = (p, isNav = false) => {
    if (isFastForwarding) {
      return
    }
    scrollPosition = p
    if (scrollPosition < 0) {
      scrollPosition = 0
    }
    if (scrollPosition > maxScroll) {
      scrollPosition = maxScroll
    }
    const progress = scrollPosition * scrollToProgress
    const currentProgress = Damped.get('progress')
    if (isNav && Math.abs(currentProgress - progress) > 2) {
      isFastForwarding = true
      const ffo = document.querySelector('.fast-forward-overlay')
      ffo.classList.add('show', 'transparent')
      setTimeout(() => {
        ffo.classList.remove('transparent')
      }, 10)
      setTimeout(() => {
        Damped.jump('progress', progress)
        ffo.classList.add('transparent')
        setTimeout(() => {
          isFastForwarding = false
          ffo.classList.remove('show')
        }, 1000)
      }, 1000)
    } else {
      let pRestricted = progress
      if (Math.abs(currentProgress - progress) > 2) {
        pRestricted = Math.round(currentProgress + 2 * Math.sign(progress - currentProgress))
        scrollPosition = pRestricted / scrollToProgress
      }
      Damped.set('progress', pRestricted)
    }
  }

  const registerListeners = () => {
    window.addEventListener('mousemove', e => {
      let isOverNav = false
      let node = e.target
      while (node !== document.body) {
        if (node.classList.contains('nav')) {
          isOverNav = true
          break
        }
        node = node.parentNode
      }

      const mouse = {
        x: e.clientX,
        y: e.clientY,
      }
      gl.updatePointer(mouse)
      overlay.updatePointer(mouse, isOverNav)
      learnMore.updatePointer(mouse)
    })

    window.addEventListener('wheel', e => {
      if (ignoreInput) {
        return
      }
      const delta = normalizeWheelDelta(e)
      updateScrollPosition(scrollPosition - delta * 60)
    })

    gestures.on('swipe', ({ start, end }) => {
      if (ignoreInput) {
        return
      }
      const delta = (end.y - start.y) / window.innerHeight * 50
      updateScrollPosition(scrollPosition - delta)
      gl.updatePointer(end)
    })

    gestures.on('pinch', ({ zoom }) => {
      if (ignoreInput) {
        return
      }
      if (zoom != 0) {
        const delta = zoom >= 1 ? zoom : -1 / zoom
        updateScrollPosition(scrollPosition + delta)
        gl.updatePointer(end)
      }
    })
  }

  const intro = () => {
    const preloader = document.getElementById('preloader')
    preloader.classList.add('transparent')
  
    setTimeout(() => {
      preloader.parentNode.removeChild(preloader)
  
      $centralLogo.classList.add('transparent')
  
      document.querySelectorAll('.hide').forEach(node => reveal(node))
  
      const o = document.querySelector('#central-logo-o')
      const oRect = o.getBoundingClientRect()
      gl.spawnAtomAt(oRect)
  
      setTimeout(() => {
        registerListeners()
        updateScrollPosition(0)
      }, 1000)
    }, 1000)
  }

  gl.create({
    container: document.getElementById('canvas-container'),
  })

  if (isIOS) {
    const tts = document.querySelector('.tap-to-start')
    tts.classList.add('show', 'transparent')
    setTimeout(() => tts.classList.remove('transparent'), 0)
    const firstClick = () => {
      gl.runVideos()
      intro()
      window.removeEventListener('touchend', firstClick)
    }
    window.addEventListener('touchend', firstClick)
  } else {
    intro()
  }

  animFrame = requestAnimationFrame(onFrame)
}

gl.eventBus.on('loading.complete', onLoadingComlete);
gl.load()

reveal($loadingProgress)
// gtag({ event: 'Screen 1' })
// gtag('event', 'Screen 1', {});
gtag('event', 'view_item', { event_category: 'engagement', event_action: 'view_item', event_label: 'Screen 1', event_value: 1 });

// document.querySelector('.cta').addEventListener('click', () => gtag({ event: 'Screen 31 button' }))
document.querySelector('.cta').addEventListener('click', () => gtag('event', 'Screen 31 button', {}));