import { paths } from '../data'
import { FontLoader, LoadingManager, TextureLoader } from "three"
import { GLTFLoader } from "./util/loaders/GLTFLoader"
import { Global } from "./Global"
import { MSDFFontLoader } from "./util/loaders/MSDFFontLoader"
import { VideoLoader } from "./util/loaders/VideoLoader"

export class ResourceManager {
  constructor() {

    this.loadingManager = new LoadingManager(
      () =>
        Global.eventBus.dispatch('loading.complete', {}),

      (url, loaded, total) =>
        Global.eventBus.dispatch('loading.progress', { url, loaded, total }),

      (url) =>
        Global.eventBus.dispatch('loading.error', { url }),
    )
    
    this.paths = {}
    this.loaders = {}
    Object.entries(paths).forEach(([name, data]) => {
      let type, path
      if (typeof data == 'string') {
        path = data
        type = path.substring(path.lastIndexOf('.') + 1, path.length)
      } else {
        path = data.path
        type = data.type
      }

      this.paths[name] = {
        path,
        type,
      }
      this.loaders[name] = this.getLoader(type)
    })

    this.resources = {}

  }

  getLoader = type => {
    switch (type) {
      case 'jpg':
      case 'png':
        return new TextureLoader(this.loadingManager)
      case 'glb':
      case 'gltf':
        return new GLTFLoader(this.loadingManager)
      case 'msdf':
        return new MSDFFontLoader(this.loadingManager)
      case 'font':
        return new FontLoader(this.loadingManager)
      case 'video':
      case 'mp4':
        return new VideoLoader(this.loadingManager)
      default:
        throw `Unknown resource type ${type}!`
    }
  }

  load = () => {
    Object.keys(this.paths).forEach(name => {
      this.loaders[name].load(this.paths[name].path, result => this.resources[name] = result)
    })
  }

  get = key => this.resources[key]
}