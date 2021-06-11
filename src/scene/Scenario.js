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
import { TrivialMesh } from "./components/TrivialMesh";
import { SpinningMesh } from "./components/SpinningMesh";
import { Moon } from "./components/Moon";
import { Rocket } from "./components/Rocket";
import { Earth } from "./components/Earth";
import { SpaceGradient } from "./components/SpaceGradient/SpaceGradient";

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
        message: 'Hydrogen.\nThe most abundant element in the universe',
        spaceGradient: true,
      }),
      new Fog({
        at: 0,
        color: Global.settings.spaceColor,
      }),
      new Stars({
        start: 0,
        finish: 4,
      }),
      new Moon({
        start: 0,
        finish: 2,
        resourceName: 'moon',
        position: new Vector3(0, .1, 0),
        scale: .1,
      }),
      new SpaceGradient({
        start: -1,
        finish: 4,
      }),


      new Text({
        start: 1,
        message: 'A fuel source so powerful it took us to the moon',
        spaceGradient: true,
      }),
      new Rocket({
        start: 1,
        resourceName: 'rocket',
        position: new Vector3(-.8, -1, .25),
        scale: 1,
      }),


      new Text({
        start: 2,
        message: 'There is enough to power our planet forever',
        spaceGradient: true,
      }),
      new Earth({
        start: 1,
        finish: 4,
        resourceName: 'earth',
        position: new Vector3(0, .05, 0),
        scale: .1,
      }),


      new Text({
        start: 3,
        message: 'So where on Earth is it? That’s easy, the world is covered in it',
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


      new Text({
        start: 5,
        finish: 6,
        message: 'It\'s in our water - a source of life and energy',
      }),
      new TrivialMesh({
        start: 5,
        resourceName: 'cloud',
        position: new Vector3(0, -35, 100),
        scale: 25,
      }),
      new TrivialMesh({
        start: 5,
        resourceName: 'cloud',
        position: new Vector3(0, -35, -100),
        scale: 25,
      }),


      new Text({
        start: 6,
        message: 'Hydrogen & Oxygen are the ingredients for water or H2O',
      }),


      new Text({
        start: 7,
        message: 'We separate water to produce hydrogen through electrolysis',
      }),


      new Text({
        start: 8,
        message: 'Using a metal hydride to store the hydrogen safely',
      }),
      new TrivialMesh({
        start: 8,
        resourceName: 'rug',
        position: new Vector3(0, -.1, 20),
        scale: 1.5,
      }),


      new Text({
        start: 9,
        message: 'A fuel cell converts hydrogen to energy by just adding air',
      }),
      new Fog({
        at: 9,
        color: Global.settings.skyColor,
      }),


      // 10 is just clouds


      new Text({
        start: 11,
        message: 'Creating lots of energy to power the world',
      }),
      new Fog({
        at: 11,
        color: 0x14A3C2,
      }),
      new TrivialMesh({
        start: 11,
        resourceName: 'island',
        position: new Vector3(-.4, -.4, 0),
        scale: .5,
      }),
      new TrivialMesh({
        start: 11,
        resourceName: 'island',
        position: new Vector3(.5, .5, 0),
        scale: .4,
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
        color: 0x14A3C2,
      }),


      new Text({
        start: 13,
        message: 'If we use renewable energy we can create green hydrogen',
      }),


      new Text({
        start: 14,
        message: 'This can reduce pollution and protect our environment',
      }),
      new Fishes({
        start: 14,
        fishNames: ['fish', 'goldfish'],
        scale: .1,
      }),
      new Glows({
        start: 14,
        finish: 15,
      }),


      new Text({
        start: 15,
        message: 'Giving the world all the energy it needs',
      }),
      new Glows({
        start: 15,
        finish: 16,
      }),


      new Text({
        start: 16,
        message: 'Powering our planet with the help of the sun',
      }),


      new Text({
        start: 17,
        message: 'LAVO for life',
      }),
      new ForLife({
        start: 17,
        finish: 20,
        video: 'unit',
      }),
      new Fog({
        at: 16,
        color: 0x24093D,
      }),


      new Fog({
        at: 18,
        color: 0x24093D,
      }),


      // COLUMN 4
      new Text({
        start: 19,
        message: 'The LAVO Hydrogen Energy Storage System',
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
        position: new Vector3(0, -20, 20),
        scale: 1,
        biasRotation: -Math.PI * .25,
      }),
      new RotatingMesh({
        start: 20,
        resourceName: 'duck',
        position: new Vector3(0, -20, -20),
        scale: 1,
        biasRotation: Math.PI * .75,
      }),


      new VideoScreen({
        start: 21,
        video: 'bike',
      }),


      new Text({
        start: 22,
        message: 'The Lavo Bike',
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
      }),


      new Text({
        start: 25,
        message: 'The LAVO barbeque',
        color: black,
      }),


      new Text({
        start: 26,
        message: 'Cook 150 sausages with just 1 cup of water',
        color: black,
      }),
      new RotatingMesh({
        start: 26,
        resourceName: 'hotdog',
        position: new Vector3(0, -25, 100),
        scale: 20,
        biasRotation: -Math.PI * .25,
      }),
      new RotatingMesh({
        start: 26,
        resourceName: 'hotdog',
        position: new Vector3(0, -25, -100),
        scale: 20,
        biasRotation: Math.PI * .75,
      }),


      /// FINAL
      new Text({
        start: 27,
        message: 'Changing the way we live with energy\nJoin our LAVO community',
        color: black,
      }),
      new Fog({
        at: 27,
        color: 0xffffff,
      }),

    ]

    for (let i = 0; i < 20; i++) {
      this.items.push(
        new SpinningMesh({
          start: 0,
          resourceName: 'atom',
          position: new Vector3(
            Math.random() - .5,
            Math.random() - .5,
            Math.random() - .5,
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