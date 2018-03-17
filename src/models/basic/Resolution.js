/**
 */

export class Resolution {
  constructor (data) {
    this.w = null
    this.h = null

    if (data) {
      this.fromJson(data)
    }
  }

  toString () {
    return `${this.w} x ${this.h} px`
  }

  /**
   * @param {object} data
   */
  fromJson (data) {
    if (typeof data !== 'object') return
    this.w = data.w
    this.h = data.h
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'w'] = this.w
    data[prefix + 'h'] = this.h
    console.log('--> data: >>>>>>')
    console.log(data)
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {SourceURL} original
   */
  updatedEntries (prefix, data, original) {
    if (original && this.w === original.w) {
      delete data[prefix + 'w']
    }
    if (original && this.h === original.h) {
      delete data[prefix + 'h']
    }
  }
}
