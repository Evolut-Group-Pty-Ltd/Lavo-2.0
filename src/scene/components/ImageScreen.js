import vertexShader from '../materials/basicNoSRGB/vert.glsl'
import fragmentShader from '../materials/basicNoSRGB/frag.glsl'

import { Mesh, Color, PlaneBufferGeometry, ShaderMaterial } from "three";
import { Global } from "../Global";
import { hold, smoothstep } from "../../utils/interpolations";

export class ImageScreen extends Mesh {
  constructor({
    start,
    finish = start + 1,
    position,
    image,
    size = 15,
  }) {
    const map = Global.assets.get(image)
    const img = map.image
    const aspect = img.width / img.height

    super(
      new PlaneBufferGeometry(size * aspect, size, 1, 1),
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

    this.depth = position.z * Global.settings.sceneDepth
    const bounds = Global.screen.getBoundsByDepth(this.depth)

    this.position.set(
      position.x * bounds.x, 
      position.y * bounds.y,
      this.depth,
    )

    this.start = start - .5
    this.finish = finish - .5
    
    Global.eventBus.on('progress', this.onProgress)
  }
  
  onProgress = progress => {
    this.visible = progress > this.start - 1 && progress < this.finish + 1
    if (this.visible) {
      const p = hold(
        this.start, this.start + .5,
        this.finish - .5, this.finish,
        progress
      )
      this.position.z = this.depth + p * Global.settings.sceneDepth
      this.material.uniforms.opacity.value = smoothstep(1, .9, p)
    }
  }
}