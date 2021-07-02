import { Euler, Vector3, Color } from "three";
import { Global } from "./Global";
import { Text } from "./components/Text/Text";
import { Fog } from "./components/Fog";
import { Bubbles } from "./components/Bubbles/Bubbles";
import { RotatingMesh } from "./components/RotatingMesh";
import { VideoScreen } from "./components/VideoScreen";
import { Stars } from "./components/Stars/Stars";
import { Glows } from "./components/Glows/Glows";
import { Fishes } from "./components/Fishes";
import { ForLife } from "./components/ForLife/ForLife";
import { SkyMesh } from "./components/SkyMesh";
import { Hydrogen } from "./components/Hydrogen";
import { Moon } from "./components/Moon/Moon";
import { Earth } from "./components/Earth/Earth";
import { SpaceGradient } from "./components/SpaceGradient/SpaceGradient";
import { WaterDrops } from "./components/WaterDrops/WaterDrops";
import { MetalHydride } from "./components/MetalHydride";
import { JellyFishes } from "./components/JellyFishes/JellyFishes";

export class Scenario {
  constructor({
    scene,
  }) {

    const black = new Color(0x222222)

    Text.defaultFont = {
      font: Global.assets.get('font'),
      map: Global.assets.get('fontMap'),
    }

    this.items = [

      new Text({
        start: 0,
        message: 'Hydrogen is the most abundant element in the universe',
        spaceGradient: true,
      }),
      new Fog({
        at: 0,
        color: Global.settings.spaceColor,
      }),
      new Stars({
        start: -1,
        finish: 3.85,
      }),
      new Moon({
        start: 0,
        finish: 2,
        resourceName: 'moon',
        position: new Vector3(0, 0, -.1),
        scale: 3,
        rocketResourceName: 'rocket',
      }),
      new SpaceGradient({
        start: -100,
        finish: 3.85,
      }),


      new Text({
        start: 1,
        message: 'A fuel source so powerful it took us to the moon',
        spaceGradient: true,
      }),


      new Text({
        start: 2,
        message: 'There is enough hydrogen to power the planet forever',
        spaceGradient: true,
      }),
      new Earth({
        start: 1,
        finish: 4,
        resourceName: 'earth',
        position: new Vector3(0, .15, 0),
        scale: 3,
      }),


      new Text({
        start: 3,
        message: 'So where on Earth is it?\nThat\'s easy, the world is covered in it',
        mobileMessage: 'So where on Earth\n is it?\nThat\'s easy, the world is covered in it',
        spaceGradient: true,
      }),
      new Fog({
        at: 3,
        color: Global.settings.spaceColor,
      }),


      // COLUMN 2
      new Fog({
        at: 4,
        color: Global.settings.skyColor,
      }),
      new SkyMesh({
        start: 4.45,
        finish: 5,
        resourceName: 'cloud',
        position: new Vector3(-.7, .5, .02),
        scale: 25,
      }),
      new SkyMesh({
        start: 4.45,
        finish: 5,
        resourceName: 'cloud',
        position: new Vector3(-.9, -.75, -.01),
        scale: 40,
      }),
      new SkyMesh({
        start: 4.45,
        finish: 5,
        resourceName: 'cloud',
        position: new Vector3(0, .2, .05),
        scale: 30,
      }),
      new SkyMesh({
        start: 4.45,
        finish: 5,
        resourceName: 'cloud',
        position: new Vector3(.3, -.5, 0),
        rotation: new Euler(0, Math.PI * .25, .072),
        scale: 25,
      }),
      new SkyMesh({
        start: 4.45,
        finish: 5,
        resourceName: 'cloud',
        position: new Vector3(.8, .6, 0),
        rotation: new Euler(0, -Math.PI * .15, -.06),
        scale: 20,
      }),


      new Text({
        start: 5,
        finish: 6,
        message: 'It\'s in our water - a source\nof life and energy',
        mobileMessage: 'It\'s in our water - a source of life and energy',
      }),
      new SkyMesh({
        start: 5,
        resourceName: 'cloud',
        position: new Vector3(-.85, -.35, -.05),
        rotation: new Euler(0, Math.PI * .75, 0),
        scale: 25,
      }),
      new SkyMesh({
        start: 5,
        resourceName: 'cloud',
        position: new Vector3(1.35, 1, .05),
        rotation: new Euler(0, -Math.PI * .15, .23),
        scale: 60,
      }),
      new WaterDrops({
        start: 5,
      }),


      new Text({
        start: 6,
        message: 'Hydrogen & Oxygen are the ingredients for water or H₂O',
      }),
      new SkyMesh({
        start: 6,
        resourceName: 'cloud',
        position: new Vector3(-1.5, .05, .04),
        rotation: new Euler(0, -Math.PI * .23, -.24),
        scale: 55,
      }),
      new SkyMesh({
        start: 6,
        resourceName: 'cloud',
        position: new Vector3(.95, -.6, -.075),
        rotation: new Euler(0, Math.PI * .35, .15),
        scale: 30,
      }),


      new Text({
        start: 7,
        message: 'We separate water to produce hydrogen through electrolysis',
      }),


      new Text({
        start: 8,
        message: 'Using a metal hydride to store the hydrogen safely',
      }),
      new MetalHydride({
        start: 8,
        resourceName: 'hydride',
        position: new Vector3(0, -.25, 0),
        scale: 6,
      }),
      new SkyMesh({
        start: 8,
        resourceName: 'cloud',
        position: new Vector3(-1.75, .5, .03),
        rotation: new Euler(0, -Math.PI * .5, .4),
        scale: 50,
      }),
      new SkyMesh({
        start: 8,
        resourceName: 'cloud',
        position: new Vector3(.95, -.7, -.02),
        rotation: new Euler(0, Math.PI * .15, -.15),
        scale: 20,
      }),


      new Text({
        start: 9,
        message: 'A fuel cell converts hydrogen to energy by just adding air',
      }),
      new Fog({
        at: 9,
        color: Global.settings.skyColor,
      }),
      
      
      // 10
      new SkyMesh({
        start: 9.25,
        finish: 11,
        resourceName: 'cloud',
        position: new Vector3(-.7, .5, 0),
        rotation: new Euler(0, -.573, .108),
        scale: 35,
      }),
      new SkyMesh({
        start: 10,
        finish: 11,
        resourceName: 'cloud',
        position: new Vector3(-.9, -.75, .01),
        rotation: new Euler(0, .489, .076),
        scale: 25,
      }),
      new SkyMesh({
        start: 10.25,
        finish: 11,
        resourceName: 'cloud',
        position: new Vector3(0, .2, -.05),
        rotation: new Euler(0, .351, .086),
        scale: 30,
      }),
      new SkyMesh({
        start: 10.5,
        finish: 11.25,
        resourceName: 'cloud',
        position: new Vector3(.3, -.5, .02),
        rotation: new Euler(0, Math.PI * .25, .072),
        scale: 25,
      }),
      new SkyMesh({
        start: 9.25,
        finish: 11,
        resourceName: 'cloud',
        position: new Vector3(.8, .6, 0),
        rotation: new Euler(0, -Math.PI * .15, .12),
        scale: 32,
      }),


      new Text({
        start: 11,
        message: 'Creating lots of energy\nto power the world',
        mobileMessage: 'Creating lots of energy to power the world',
      }),
      new Fog({
        at: 11,
        color: 0x14A3C2,
      }),
      new SkyMesh({
        start: 10.75,
        finish: 12,
        resourceName: 'island',
        position: new Vector3(-1.5, -1.5, -.01),
        scale: 50,
        mobilePosition: new Vector3(-.2, -1.5, -.01),
      }),
      new SkyMesh({
        start: 10.75,
        finish: 12,
        resourceName: 'island',
        position: new Vector3(1.2, 1, -.02),
        scale: 45,
        mobilePosition: new Vector3(.2, 2.75, -.01),
      }),


      // COLUMN 3
      new Text({
        start: 12,
        message: 'Clean energy is needed to reduce our carbon footprint',
      }),
      new Bubbles({
        start: 12,
        finish: 14,
      }),
      new Fog({
        at: 12,
        color: 0x89CAE5,
      }),


      new Text({
        start: 13,
        message: 'If we use renewable energy we can create green hydrogen',
      }),
      new Fog({
        at: 13,
        color: 0x218CD9,
      }),



      new Text({
        start: 14,
        message: 'This can reduce pollution and protect our environment',
      }),
      new Fishes({
        start: 14,
        fishNames: ['fishA', 'fishB'],
        count: 10,
        scale: 3,
      }),
      new JellyFishes({
        start: 14,
        resourceName: 'jellyfish',
        scale: 7,
      }),
      new Fog({
        at: 14,
        color: 0x0050AD,
      }),


      new Text({
        start: 15,
        message: 'Giving the world all the energy it needs',
      }),
      new Glows({
        start: 15,
      }),
      new Fog({
        at: 15,
        color: 0x100635,
      }),


      new Text({
        start: 16,
        message: 'Powering our planet with the help of the sun',
      }),
      new Fog({
        at: 16,
        color: 0x24093D,
      }),
      new ForLife({
        start: 16,
        finish: 19,
        video: 'unit',
      }),


      new Text({
        start: 17,
        message: 'LAVO™ FOR LIFE',
      }),
      new Fog({
        at: 17,
        color: 0x24093D,
      }),

      new Fog({
        at: 18,
        color: 0xffffff,
      }),


      // COLUMN 4
      new Text({
        start: 19,
        message: 'The LAVO™ Hydrogen Energy Storage System',
        mobileMessage: 'The LAVO™\nHydrogen Energy Storage System',
        color: black,
      }),
      new Fog({
        at: 19,
        color: 0xffffff,
      }),
      

      new Text({
        start: 20,
        message: 'Imagine, 1 bath of water could power the house for 2 weeks',
        color: black,
      }),
      new RotatingMesh({
        start: 20,
        resourceName: 'duck',
        position: new Vector3(0, -30, 20),
        scale: 7.5,
        biasRotation: -Math.PI * .35,
      }),
      new RotatingMesh({
        start: 20,
        resourceName: 'duck',
        position: new Vector3(0, -30, -20),
        scale: 7.5,
        biasRotation: Math.PI * .65,
      }),


      new VideoScreen({
        start: 21,
        video: 'bike',
      }),


      new Text({
        start: 22,
        message: 'The LAVO™ Bike',
        color: black,
      }),


      new Text({
        start: 23,
        message: 'Ride from Sydney to Canberra powered by 2 bottles of water',
        color: black,
      }),


      new VideoScreen({
        start: 24,
        video: 'bbq',
        looped: false,
        delay: 2e3,
      }),


      new Text({
        start: 25,
        message: 'The LAVO™ Barbeque',
        mobileMessage: 'The LAVO™\nBarbeque',
        color: black,
      }),


      new Text({
        start: 26,
        message: 'Cook 150 sausages\nwith just 1 cup of water',
        mobileMessage: 'Cook 150 sausages with just 1 cup of water',
        color: black,
      }),
      new RotatingMesh({
        start: 26,
        resourceName: 'hotdog',
        position: new Vector3(0, -25, 100),
        scale: 7,
        biasRotation: -Math.PI * .25,
        rotateAxis: 'x',
      }),
      new RotatingMesh({
        start: 26,
        resourceName: 'hotdog',
        position: new Vector3(0, -25, -100),
        scale: 7,
        biasRotation: Math.PI * .75,
        rotateAxis: 'x',
      }),


      /// FINAL
      new Text({
        start: 27,
        message: 'Changing the way\nwe live with energy\nJoin our LAVO™ community',
        mobileMessage: 'Changing the way we live with energy\nJoin our LAVO™ community',
        mobileY: .25,
      }),
      new Fog({
        at: 27,
        color: 0xffffff,
      }),
      new Glows({
        start: 27,
      }),
      new SpaceGradient({
        start: 26.5,
        finish: 28,
      }),
    ]

    for (let i = 0; i < 10; i++) {
      this.items.push(
        new Hydrogen({
          start: 0,
          resourceName: 'atom',
          position: new Vector3(
            Math.random() - .5,
            Math.random() - .5,
            Math.random() * .8 - .4,
          ),
          rotation: new Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
          scale: 1 + Math.random() * .1,
        })
      )
    }

    Fog.initialize(scene)

    scene.add(...this.items.filter(item => item.isObject3D))
  }
}