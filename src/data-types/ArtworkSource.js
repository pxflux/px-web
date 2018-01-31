/**
 * @property {?string} type
 * @property {?string} url
 * @property {?string} version
 */
export class ArtworkSource {
  constructor (type, url, version) {
    this.type = type
    this.url = url
    this.version = version
  }

  static empty () {
    return new ArtworkSource(null, null, null)
  }

  static fromJson (value) {
    if (typeof value !== 'object') {
      return this.empty()
    }
    return new ArtworkSource(value.type, value.url, value.version)
  }

  /**
   * @param {ArtworkSource} origin
   * @return {Object}
   */
  updatedEntries (origin) {
    const data = {}
    if (this.type !== origin.type) {
      data['type'] = this.type
    }
    if (this.url !== origin.url) {
      data['url'] = this.url
    }
    if (this.version !== origin.version) {
      data['version'] = this.version
    }
    return data
  }
}
