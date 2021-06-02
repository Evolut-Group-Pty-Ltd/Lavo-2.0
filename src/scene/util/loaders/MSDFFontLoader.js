import { FileLoader } from 'three'

export class MSDFFontLoader extends FileLoader {
  constructor(manager) {
    super(manager)
  }

  load = (url, onLoad, onProgress, onError) => {
    super.load(
      url,
      res => onLoad(JSON.parse(res)),
      onProgress,
      onError,
    )
  }
}