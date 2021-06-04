import { Loader, VideoTexture } from "three"

export class VideoLoader extends Loader {
  constructor(manager) {
    super(manager)
  }

  load = (url, onLoad, onProgress, onError) => {

    url = this.manager.resolveURL(url)

    const video = document.createElement('video')
    video.preload = 'auto'
    video.crossOrigin = 'anonymus'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.style.display = 'none'

    const _load = e => {
      video.removeEventListener('error', e)
      
      onLoad(video)

      this.manager.itemEnd(url)
    }

    const _error = e => {
      video.removeEventListener('error', e)
      
      if (onError) {
        onError(e)
      }

      this.manager.itemEnd(url)
    }

    video.addEventListener('error', _error)

    this.manager.itemStart(url)
    video.src = url

    setTimeout(_load, 0)
  }

}