/**
 * @param {number} w
 * @param {number} h
 */
export class Resolution {
  /**
   * @param {number} w
   * @param {number} h
   */
  constructor (w, h) {
    this.w = isNaN(w) ? 0 : w
    this.h = isNaN(h) ? 0 : h
  }

  static empty () {
    return new Resolution(0, 0)
  }

  /**
   * @param {object} data
   */
  static fromJson (data) {
    if (typeof data !== 'object') {
      return null
    }
    return new Resolution(Number.parseInt(data.w), Number.parseInt(data.h))
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'w'] = this.w
    data[prefix + 'h'] = this.h
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Resolution} original
   */
  updatedEntries (prefix, data, original) {
    if (original && this.w === original.w) {
      delete data[prefix + 'w']
    }
    if (original && this.h === original.h) {
      delete data[prefix + 'h']
    }
  }

  toString () {
    return `${this.w} x ${this.h} px`
  }
}
