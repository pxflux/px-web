/** @prop {?string} type  - Possible values html, video */

/** @prop {?string} url   - URL to html page or a video file or Vimeo link */
export class SourceURL {
  /**
   * @param {?string} type
   * @param {?string} url
   */
  constructor (type, url) {
    this.type = type || null
    this.url = url || null
  }

  static empty () {
    return new SourceURL(null, null)
  }

  /**
   * @param {object} value
   */
  static fromJson (value) {
    if (!value && typeof value !== 'object') {
      return null
    }
    return new SourceURL(value.type, value.url)
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'type'] = this.type
    data[prefix + 'url'] = this.url
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {SourceURL} original
   */
  updatedEntries (prefix, data, original) {
    if (this.type === original.type) {
      delete data[prefix + 'type']
    }
    if (this.url === original.url) {
      delete data[prefix + 'url']
    }
  }
}
