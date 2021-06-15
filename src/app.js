import './style/site.css'

import { Controller as GLController } from "./scene/Controller";
import { normalizeWheelDelta } from "./utils/normalizeWheelDelta";
import { Nav } from "./Nav";
import { Damped } from './utils/Damped';
import { Overlay } from './Overlay';
import { LearnMore } from './LearnMore';
import { Gestures } from './utils/Gestures';

const startFrom = 0
const scrollToProgress = .005
const maxScroll = 27 / scrollToProgress
let scrollPosition = startFrom / scrollToProgress, animFrame

new Damped('progress', startFrom, .02)

const gl = new GLController()

// gl.eventBus.on('loading.error', ({url}) => {
//   console.log(`Error while loading ${url}!`)
// })

// gl.eventBus.on('loading.progress', ({loaded, total}) => {
//   console.log(`Loaded ${loaded / total * 100 | 0}%`)
// })

const nav = new Nav({
  onNavCallback: (sectionData) => {
    let progress = sectionData
    if (typeof sectionData != 'number') {
      progress = sectionData.p
    }
    updateScrollPosition(progress / scrollToProgress)
  },
})

const overlay = new Overlay()

const learnMore = new LearnMore()

const onFrame = time => {
  Damped.update()

  const progress = Damped.get('progress')
  gl.updateProgress(progress)
  nav.updateProgress(progress)
  overlay.updateProgress(progress)
  learnMore.updateProgress(progress)

  gl.onFrame(time)
  
  animFrame = requestAnimationFrame(onFrame)
}

const updateScrollPosition = p => {
  scrollPosition = p
  if (scrollPosition < 0) {
    scrollPosition = 0
  }
  if (scrollPosition > maxScroll) {
    scrollPosition = maxScroll
  }
  const progress = scrollPosition * scrollToProgress
  Damped.set('progress', progress)
}

const onLoadingComlete = () => {

  const container = document.getElementById('canvas-container')

  gl.create({
    container,
  })
  updateScrollPosition(scrollPosition)

  window.addEventListener('mousemove', e => {
    const mouse = {
      x: e.clientX,
      y: e.clientY,
    }
    gl.updatePointer(mouse)
    learnMore.updatePointer(mouse)
  })

  window.addEventListener('wheel', e => {
    const delta = normalizeWheelDelta(e)
    updateScrollPosition(scrollPosition - delta * 60)
  })

  const gestures = new Gestures(document.body)
  gestures.on('swipe', ({ start, end }) => {
    const delta = (end.y - start.y) / window.innerHeight * 50
    updateScrollPosition(scrollPosition + delta)
    gl.updatePointer(end)
    learnMore.updatePointer(end)
  })
  gestures.on('pinch', ({ zoom }) => {
    const delta = zoom >= 1 ? zoom : -1 / zoom
    updateScrollPosition(scrollPosition + delta)
    gl.updatePointer(end)
    learnMore.updatePointer(end)
  })

  animFrame = requestAnimationFrame(onFrame)
}

gl.eventBus.on('loading.complete', onLoadingComlete)
gl.load()