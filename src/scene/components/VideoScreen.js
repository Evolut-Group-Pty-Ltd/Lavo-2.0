import vertexShader from '../materials/basicNoSRGB/vert.glsl'
import fragmentShader from '../materials/basicNoSRGB/frag.glsl'

import { Mesh, Color, PlaneBufferGeometry, ShaderMaterial, VideoTexture } from "three";
import { Global } from "../Global";
import { hold, smoothstep } from "../../utils/interpolations";

export class VideoScreen extends Mesh {
  constructor({
    start,
    finish = start + 1,
    video,
    looped = true,
    delay = 0,
  }) {
    const $ = Global.assets.get(video)
    $.loop = looped
    const map = new VideoTexture($)

    super(
      new PlaneBufferGeometry(20, 20, 1, 1),
      new ShaderMaterial({
        uniforms: {
          map: { value: map },
          opacity: { value: 0 },
          fogColor: { value: new Color() },
          fogNear: { value: 1 },
          fogFar: { value: 2 },
        },
        vertexShader,
        fragmentShader,
        fog: true,
        transparent: true,
      })
    )

    this.video = $
    this.start = start - .5
    this.finish = finish - .5
    this.delay = delay
    this.playTimeout = -1
    
    this.video.pause()
    Global.eventBus.on('progress', this.onProgress)
  }
  
  onProgress = progress => {
    const oldVisible = this.visible
    this.visible = progress > this.start - 1 && progress < this.finish + 1
    if (this.visible) {
      if (!oldVisible) {
        this.video.currentTime = 0
        if (this.delay == 0) {
          this.video.play()
        } else {
          this.playTimeout = setTimeout(() => {
            this.video.play()
          }, this.delay)
        }
      }
      const p = hold(
        this.start, this.start + .5,
        this.finish - .5, this.finish,
        progress
      )
      this.position.z = p * Global.settings.sceneDepth
      this.material.uniforms.opacity.value = smoothstep(1, .9, p)
    } else {
      if (oldVisible) {
        clearTimeout(this.playTimeout)
        this.video.pause()
      }
    }
  }
}