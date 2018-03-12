/** @prop {?string} type  - Possible values html, video */

/** @prop {?string} url   - URL to html page or a video file or Vimeo link */
export class SourceURL {
  /**
   * @param {?string} type
   * @param {?string} url
   */
  constructor (type, url) {
    this.type = type
    this.url = url
  }

  static empty () {
    return new SourceURL(null, null)
  }

  /**
   * @param {object} data
   */
  static fromJson (data) {
    if (typeof data !== 'object') return
    return new SourceURL(data.type || null, data.url || null)
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
