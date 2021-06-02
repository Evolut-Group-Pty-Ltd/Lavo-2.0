import { EventDispatcher } from "./util/EventDispatcher"

export class Global {
  
  static eventBus = new EventDispatcher()
  static screen = null
  static assets = null

  static settings = {
    fogStart: 750,
    sceneDepth: 1000,

    spaceColor: 0x060635,
    skyColor: 0x77BEFF,
  }
}