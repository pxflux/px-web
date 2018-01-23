export class Dimensions {
  constructor (w, h, unit) {
    this.w = w
    this.h = h
    this.unit = unit
  }

  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Dimensions(value.w, value.h, value.unit)
  }
}
