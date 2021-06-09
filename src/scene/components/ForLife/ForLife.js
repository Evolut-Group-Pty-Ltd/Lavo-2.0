import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

import { AdditiveBlending, Color, Mesh, VideoTexture, PlaneBufferGeometry, ShaderMaterial } from 'three';
import { Global } from '../../Global';
import { smoothstep, rescale, saturate, lerp } from '../../util/interpolations';
import { AlwaysDepth } from 'three';

export class ForLife extends Mesh {
  constructor({
    start,
    finish = start + 1,
    video,
  }) {
    const $ = Global.assets.get(video)
    const map = new VideoTexture($)

    super(
      new PlaneBufferGeometry(1, 1, 1, 1),
      new ShaderMaterial({
        uniforms: {
          map: { value: map },
          color: { value: new Color(0xFEFFBC) },
          opacity: { value: 0 },
          aspect: { value: Global.screen.aspect },
          shift: { value: .1 },
          pointSize: { value: 0 },
          videoSize: { value: 0 },
          insideSize: { value: .1 },
          crownMin: { value: .2 },
          crownMax: { value: .5 },
          // fogColor: { value: new Color() },
          // fogNear: { value: 1 },
          // fogFar: { value: 2 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        // fog: true,
        depthTest: false,
      })
    )

    this.video = $
    this.preStart = start - .5
    this.start = start
    this.finish = finish

    this.video.pause()
    Global.eventBus.on('progress', this.onProgress)
    Global.eventBus.on('resize', this.onResize)
  }

  onProgress = progress => {
    const oldVisible = this.visible
    this.visible = progress >= this.preStart && progress <= this.finish
    if (this.visible) {
      if (!oldVisible) {
        this.video.play()
        this.video.currentTime = 0
      }
      const preP = saturate(rescale(
        this.preStart,
        this.start,
        progress
      ))
      const p = saturate(rescale(
        this.start,
        this.finish,
        progress
      ))
      this.position.z = (p * .9 + preP * .1) * Global.settings.sceneDepth
      this.material.uniforms.shift.value = Math.max((1 - p * 3) * .1, 0)
      this.material.uniforms.pointSize.value = 1 / lerp(32. / Global.screen.y, 15, p)
      this.material.uniforms.videoSize.value = 1 / lerp(0, .75, p)
      this.material.uniforms.insideSize.value = lerp(.1, .5, Math.max(0, p * 3 - 1))
      this.material.uniforms.crownMin.value = lerp(.2, .1, p * 3)
      this.material.uniforms.crownMax.value = lerp(.5, .25,p * 3)
      this.material.uniforms.opacity.value = smoothstep(1, 2 / 3, p)
    } else {
      if (oldVisible) {
        this.video.pause()
      }
    }
  }

  onResize = () => {
    this.material.uniforms.aspect.value = Global.screen.aspect
  }
}