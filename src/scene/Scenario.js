import { Text } from "./components/Text/Text";
import { Fog } from "./components/Fog";
import { Color } from "three";
import { Bubbles } from "./components/Bubbles/Bubbles";
import { Global } from "./Global";

export class Scenario {
  constructor({
    scene,
  }) {

    const black = new Color('black')

    Text.defaultFont = {
      font: Global.assets.get('font'),
      map: Global.assets.get('fontMap'),
    }

    this.items = [

      new Text({
        start: 0,
        message: 'Hydrogen.\nThe most abundant element in the universe.',
      }),
      new Fog({
        at: 0,
        color: Global.settings.spaceColor,
      }),


      new Text({
        start: 1,
        message: 'A fuel source so powerful it helped us to travel to the moon.',
      }),
      new Fog({
        at: 1,
        color: 0,
      }),


      new Text({
        start: 2,
        message: 'There is enough to power our planet forever.',
      }),


      new Text({
        start: 3,
        message: 'So where do we find Hydrogen on Earth?',
      }),


      new Text({
        start: 4,
        finish: 6,
        message: 'Water.\nOur source of life and energy.',
      }),
      new Fog({
        at: 4,
        color: 0,
      }),


      // COLUMN 2
      new Fog({
        at: 5,
        color: Global.settings.skyColor,
      }),


      new Text({
        start: 6,
        message: 'Water is made from Hydrogen & Oxygen\nH2O',
      }),


      new Text({
        start: 7,
        message: 'We can separate water to produce hydrogen through electrolysis.',
      }),


      new Text({
        start: 8,
        message: 'Storing it safely with the help of a metal hydride.',
      }),


      new Text({
        start: 9,
        message: 'Converting it to energy in a fuel cell by simply adding air.',
      }),


      new Text({
        start: 10,
        message: 'Creating an abundant supply of energy to power our world',
      }),
      new Fog({
        at: 10,
        color: Global.settings.skyColor,
      }),


      // COLUMN 3
      new Text({
        start: 11,
        message: 'We need clean energy to reduce our carbon footprint and improve our world.',
      }),
      new Bubbles({
        start: 11,
        finish: 13,
      }),
      new Fog({
        at: 11,
        color: 0x14A3C2,
      }),


      new Text({
        start: 12,
        message: 'Using renewable energy we can create green hydrogen.',
      }),


      new Text({
        start: 13,
        message: 'Reducing pollution and protecting our environment',
      }),


      new Text({
        start: 14,
        message: 'with an unlimited source of energy',
      }),


      new Text({
        start: 15,
        message: 'to power our planet with the help of the sun.',
      }),


      new Text({
        start: 16,
        message: 'LAVO for life',
      }),
      new Fog({
        at: 11,
        color: 0x24093D,
      }),


      new Fog({
        at: 17,
        color: 0,
      }),


      // COLUMN 4
      new Fog({
        at: 18,
        color: 0xffffff,
      }),


      new Text({
        start: 19,
        message: 'The LAVO Hydrogen Energy Storage System',
        color: black,
      }),


      new Text({
        start: 20,
        message: 'Just one bath tub of water could power your home for 2 weeks.',
        color: black,
      }),


      new Text({
        start: 21,
        message: 'The LAVO bike',
        color: black,
      }),


      // image


      new Text({
        start: 22,
        message: 'Two cycling water bottles can power your bike from Sydney to Canberra (300kms).',
        color: black,
      }),


      //image


      new Text({
        start: 24,
        message: 'The LAVO barbeque',
        color: black,
      }),


      new Text({
        start: 25,
        message: 'A cup of water provides enough heat to cook 300 sausages.',
        color: black,
      }),


      /// FINAL
      new Text({
        start: 26,
        message: 'Join the LAVO community to see how we are changing the way we use energy.',
        color: black,
      }),
      new Fog({
        at: 26,
        color: 0xffffff,
      }),

    ]

    Fog.initialize(scene)

    scene.add(...this.items.filter(item => item.isObject3D))
  }
}