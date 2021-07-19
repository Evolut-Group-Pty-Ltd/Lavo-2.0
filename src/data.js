//a bcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+`-=\,./;'\[]|<>?:"|{}₂’-—–

export const paths = {
  font: {
    path: 'fonts/avenir-next-lt-pro-demi-msdf.json',
    type: 'msdf',
  },
  fontMap: 'fonts/avenir-next-lt-pro-demi.png',
  
  atom: 'models/atom/atom.gltf',
  cloud: 'models/cloud/cloud.gltf',
  duck: 'models/duck3/rubberduckv3.gltf',
  earth: 'models/earth/earth.glb',
  fishA: 'models/fishA/fishA.gltf',
  fishB: 'models/fishB/fishB.gltf',
  jellyfish: 'models/jellyfish/jellyfish.glb',
  hydride: 'models/hydride/hydride.glb',
  hotdog: 'models/hotdog/hotdog.gltf',
  island: 'models/island/island.gltf',
  moon: 'models/moon/moon.gltf',
  rocket: 'models/rocket/rocket.gltf',

  // bathtub: 'images/bathtub.png',
  // house: 'images/house.png',
  // bottles: 'images/bottles.png',
  // cyclist: 'images/cyclist.png',
  // bbqImage: 'images/bbq.png',
  // glassWater: 'images/glass-water.png',
  
  bbq: 'https://lavo-microsite-videos.s3.ap-southeast-2.amazonaws.com/bbq.mp4',
  bike: 'https://lavo-microsite-videos.s3.ap-southeast-2.amazonaws.com/bike.mp4',
  unit: 'https://lavo-microsite-videos.s3.ap-southeast-2.amazonaws.com/unit.mp4',
}

export const navSections = {
  space: {
    p: 0,
    label: 'Hydrogen',
  },
  sky: {
    p: 5,
    label: 'Creating Energy',
  },
  ocean: {
    p: 11,
    label: 'Protect the Planet',
  },
  lavo: {
    p: 18,
    inverse: true,
    label: 'Power Your Life',
  },
  contact: {
    p: 27,
    label: 'Learn More',
  },
}

export const overlays = [{
  at: 7,
  header: 'LAVO™ uses an electrolyser to split water into hydrogen and oxygen',
  content: 'We use an electrolyser to convert excess electrical energy from the solar system through electrolysis, where the water is split into hydrogen and oxygen.\n\nThis occurs through the electrical charge being applied to the water, causing it to break the chemical bond between the hydrogen and oxygen atoms and produce particles called ions. The energy is then stored as hydrogen and the oxygen is released into the atmosphere.',
  background: 'rgba(119, 190, 255, .95)',
}, {
  at: 8,
  header: 'Storing hydrogen safely with a metal hydride',
  content: 'Metal hydrides are a compact and safe way to store hydrogen at low pressure and room temperature.​​​\n\nLAVO™ use an innovative and patented hydride formula that is a unique combination of common minerals to make an alloy. Hydrogen atoms bond to the alloy enabling safe and non-flammable storage that is energy efficient, carbon neutral and fully recyclable.',
  background: 'rgba(119, 190, 255, .95)',
}, {
  at: 9,
  header: 'Converting hydrogen back into energy with a fuel cell',
  content: 'Fuel cells work similar to batteries, however they do not run down or need recharging.\n\nElectricity is generated by combining hydrogen with oxygen in the air through a pair of redox reactions. This reaction creates a positive electric charge for powering your home and generates heat and produces water at the same time.',
  background: 'rgba(119, 190, 255, .95)',
}, {
  at: 11,
  header: 'Calculation of water to hydrogen to energy',
  content: '9 litres of water produces enough energy to power the average Australian home for more than a day. That’s 22 Kilowatt hours of electricity.\n\n1 litre of water (H2O) can make 111 grams of Hydrogen (H2)\n1 kilogram of Hydrogen (H2) produces 120 Megajoules (MJ) of energy\n1 Megajoules (MJ) creates 166 watts of electricity\nThis means a 10 litre bucket of water will make:\n1.11 Kilograms of Hydrogen (H2)\n133.33 Megajoules (MJ) of energy\n22.22 Kilowatt hours of electricity\nPower for days.',
  background: 'rgba(44, 169, 209, .95)',
}, ]