import vertexShader from './basicNoSRGB/vert.glsl'
import fragmentShader from './basicNoSRGB/frag.glsl'

import { Mesh, Color, PlaneBufferGeometry, ShaderMaterial, VideoTexture } from "three";
import { Global } from "../Global";
import { hold, smoothstep } from "../../utils/interpolations";

export class VideoScreen extends Mesh {
  constructor({
    start,
    finish = start + 1,
    video,
  }) {
    const $ = Global.assets.get(video)
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
    
    this.video.pause()
    Global.eventBus.on('progress', this.onProgress)
  }
  
  onProgress = progress => {
    const oldVisible = this.visible
    this.visible = progress > this.start - 1 && progress < this.finish + 1
    if (this.visible) {
      if (!oldVisible) {
        this.video.play()
        this.video.currentTime = 0
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
        this.video.pause()
      }
    }
  }
}