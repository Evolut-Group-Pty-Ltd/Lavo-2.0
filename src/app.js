import { Controller } from "./scene/Controller";

const paths = {
  font: {
    path: 'fonts/avenir-next-regular-msdf.json',
    type: 'msdf',
  },
  fontMap: 'fonts/avenir-next-regular.png',
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

gl.eventBus.on('loading.complete', () => {

  const container = document.getElementById('canvas-container');

  gl.create({
    container,
  })

  gl.start()

  container.addEventListener('mousemove', e => {
    gl.update({
      mouse: {
        x: e.offsetX,
        y: e.offsetY,
      },
    })
  })
})

gl.load()