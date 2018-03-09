/** @prop {?string} type  - Possible values html, video */
import { cleanEntries } from './CleanEntries'

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
   * @param {SourceURL} original
   * @return {Object}
   */
  updatedEntries (original) {
    const data = {}
    if (this.type !== original.type) {
      data.type = this.type
    }
    if (this.url !== original.url) {
      data.url = this.url
    }
    return cleanEntries(data)
  }
}
