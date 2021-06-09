import './style/site.css'

import { Controller } from "./scene/Controller";
import { normalizeWheelDelta } from "./utils/normalizeWheelDelta";
import { Nav } from "./Nav";
import { Damped } from './utils/Damped';

const paths = {
  font: {
    path: 'fonts/avenir-next-lt-pro-demi-msdf.json',
    type: 'msdf',
  },
  fontOld: {
    path: 'fonts/avenir-next-regular-msdf.json',
    type: 'msdf',
  },
  fontMap: 'fonts/avenir-next-lt-pro-demi.png',
  fontOldMap: 'fonts/avenir-next-regular.png',
  
  atom: 'models/atom.gltf',
  cloud: 'models/cloud.gltf',
  duck: 'models/duck.gltf',
  earth: 'models/earth.gltf',
  fish: 'models/fish.gltf',
  goldfish: 'models/goldfish.gltf',
  hotdog: 'models/hotdog.gltf',
  island: 'models/island.gltf',
  moon: 'models/moon.gltf',
  rocket: 'models/rocket.gltf',
  rug: 'models/rug.gltf',
  
  bbq: 'video/bbq.mp4',
  bike: 'video/bike.mp4',
  unit: 'video/unit.mp4',
}

const navSections = {
  space: 0,
  sky: 5,
  ocean: 11,
  lavo: {
    p: 18,
    inverse: true,
  },
  contact: {
    p: 27,
    inverse: true,
  },
}

const gl = new Controller({
  paths,
})

new Damped('progress', 0, .02)

console.log("Damped", Damped.values)

const nav = new Nav({
  sections: navSections,
  onNavCallback: (sectionData) => {
    let progress = sectionData
    if (typeof sectionData != 'number') {
      progress = sectionData.p
    }
    updateScrollPosition(progress * 100)
  },
})

// gl.eventBus.on('loading.error', ({url}) => {
//   console.log(`Error while loading ${url}!`)
// })

// gl.eventBus.on('loading.progress', ({loaded, total}) => {
//   console.log(`Loaded ${loaded / total * 100 | 0}%`)
// })

let scrollPosition = 0, animFrame

const onFrame = time => {
  Damped.update()

  const progress = Damped.get('progress')
  gl.updateProgress(progress)
  nav.updateProgress(progress)
  gl.onFrame(time)
  
  animFrame = requestAnimationFrame(onFrame)
}

const updateScrollPosition = p => {
  scrollPosition = p
  if (scrollPosition < 0) {
    scrollPosition = 0
  }
  if (scrollPosition > 2700) {
    scrollPosition = 2700
  }
  const progress = scrollPosition / 100
  Damped.set('progress', progress)
  // nav.updateProgress(progress)
}

gl.eventBus.on('loading.complete', () => {

  const container = document.getElementById('canvas-container');

  gl.create({
    container,
  })

  container.addEventListener('mousemove', e => {
    gl.updatePointer({
      mouse: {
        x: e.offsetX,
        y: e.offsetY,
      },
    })
  })

  window.addEventListener('wheel', e => {
    const delta = normalizeWheelDelta(e)
    updateScrollPosition(scrollPosition - delta * 60)
  })

  animFrame = requestAnimationFrame(onFrame)
})

gl.load()