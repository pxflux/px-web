export class ArtworkSpecifications {
  constructor (numberScreens, screenResolutions) {
    this.sourseUrl = null
    this.numberScreens = numberScreens
    this.screenResolutions = screenResolutions
    this.screenResolutions = screenResolutions
  }

  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new ArtworkSpecifications(value.numberScreens, value.screenResolutions)
  }
}
