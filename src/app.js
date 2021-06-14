//a bcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+`-=\,./;'\[]|<>?:"|{}₂’-—–
import './style/site.css'

import { Controller } from "./scene/Controller";
import { normalizeWheelDelta } from "./utils/normalizeWheelDelta";
import { Nav } from "./Nav";
import { Damped } from './utils/Damped';
import { Overlay } from './Overlay';

const paths = {
  font: {
    path: 'fonts/filson-pro-bold-msdf.json',
    type: 'msdf',
  },
  fontMap: 'fonts/filson-pro-bold-patch.png',
  
  atom: 'models/atom/atom.gltf',
  cloud: 'models/cloud/cloud.gltf',
  duck: 'models/duck/duck.gltf',
  earth: 'models/earth/earth.glb',
  fishA: 'models/fishA/fishA.gltf',
  fishB: 'models/fishB/fishB.gltf',
  jellyfish: 'models/jellyfish/jellyfish.glb',
  hydride: 'models/hydride/hydride.glb',
  hotdog: 'models/hotdog/hotdog.gltf',
  island: 'models/island/island.gltf',
  moon: 'models/moon/moon.gltf',
  rocket: 'models/rocket/rocket.gltf',

  bathtub: 'images/bathtub.png',
  house: 'images/house.png',
  bottles: 'images/bottles.png',
  cyclist: 'images/cyclist.png',
  bbqImage: 'images/bbq.png',
  glassWater: 'images/glass-water.png',
  
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
  },
}

const overlays = [{
  at: 6,
  header: 'Lorem ipsum dolor sit amet',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc feugiat facilisis hendrerit. Duis condimentum viverra tellus, eu rhoncus ligula viverra in. Nunc eget viverra est, sit amet ultrices tellus. Nunc pulvinar ante vel metus efficitur pretium et a turpis. Ut dictum accumsan felis et ultrices. Curabitur sit amet magna nulla. Ut ut ipsum fringilla elit sollicitudin tristique. Aliquam porttitor imperdiet tincidunt. Cras venenatis, mi sed tincidunt pretium, lorem ex ultricies velit, in bibendum ipsum risus sed nibh. Sed et urna lectus. Proin lobortis laoreet ante vulputate aliquet. Donec venenatis dui nec urna sagittis euismod. Aliquam erat volutpat.\nCurabitur faucibus nec quam a dignissim. Vestibulum sem odio, lobortis a blandit eget, placerat non sem. Nunc sit amet suscipit dolor. Nam eu luctus elit, quis convallis lectus. Ut suscipit non nulla id fermentum. Mauris faucibus imperdiet lectus sit amet malesuada. Nulla fermentum, leo sed volutpat volutpat, turpis mauris placerat massa, sed malesuada risus nisl in lectus. Integer rutrum neque ut ex egestas accumsan. Etiam mi tortor, porttitor at eros molestie, accumsan congue tortor. Nullam quis consectetur ligula, ac commodo purus. Duis mattis augue quis vulputate volutpat. Ut semper congue nunc. Sed non elit in elit rutrum tempus eget et est. Curabitur ac sapien vitae est lobortis condimentum. Ut sodales a nibh nec elementum. Donec commodo mi sed maximus convallis.',
  background: 'rgba(119, 190, 255, .95)',
}]

const startFrom = 0
const scrollToProgress = .005
const maxScroll = 27 / scrollToProgress
let scrollPosition = startFrom / scrollToProgress, animFrame

new Damped('progress', startFrom, .02)

const gl = new Controller({
  paths,
})

const nav = new Nav({
  sections: navSections,
  onNavCallback: (sectionData) => {
    let progress = sectionData
    if (typeof sectionData != 'number') {
      progress = sectionData.p
    }
    updateScrollPosition(progress / scrollToProgress)
  },
})

const overlay = new Overlay({
  overlays,
})

// gl.eventBus.on('loading.error', ({url}) => {
//   console.log(`Error while loading ${url}!`)
// })

// gl.eventBus.on('loading.progress', ({loaded, total}) => {
//   console.log(`Loaded ${loaded / total * 100 | 0}%`)
// })


const onFrame = time => {
  Damped.update()

  const progress = Damped.get('progress')
  gl.updateProgress(progress)
  nav.updateProgress(progress)
  overlay.updateProgress(progress)
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
  // nav.updateProgress(progress)
}

gl.eventBus.on('loading.complete', () => {

  const container = document.getElementById('canvas-container');

  gl.create({
    container,
  })
  updateScrollPosition(scrollPosition)

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