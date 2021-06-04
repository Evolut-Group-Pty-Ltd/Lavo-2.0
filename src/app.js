import { Controller } from "./scene/Controller";
import { normalizeWheelDelta } from "./utils/normalizeWheelDelta";

const paths = {
  font: {
    path: 'fonts/avenir-next-regular-msdf.json',
    type: 'msdf',
  },
  fontMap: 'fonts/avenir-next-regular.png',
  
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

const gl = new Controller({
  paths,
})

// gl.eventBus.on('loading.error', ({url}) => {
//   console.log(`Error while loading ${url}!`)
// })

// gl.eventBus.on('loading.progress', ({loaded, total}) => {
//   console.log(`Loaded ${loaded / total * 100 | 0}%`)
// })

let scrollPosition = 0

gl.eventBus.on('loading.complete', () => {

  const container = document.getElementById('canvas-container');

  gl.create({
    container,
  })

  gl.start()

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
    scrollPosition -= delta * 60
    if (scrollPosition < 0) {
      scrollPosition = 0
    }
    if (scrollPosition > 2700) {
      scrollPosition = 2700
    }
    const progress = scrollPosition / 100
    gl.updateProgress(progress)
  })
})

gl.load()