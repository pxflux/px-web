/** @prop {?string} type  - Possible values html, video */
/** @prop {?string} url   - URL to html page or a video file or Vimeo link */

export class SourceURL {
  /**
   * @param {object=} data
   */
  constructor (data) {
    this.type = ''
    this.url = ''

    if (typeof data === 'object') {
      this.fromJson(data)
    }
  }

  /**
   * @param {object} data
   */
  fromJson (data) {
    if (typeof data !== 'object') return
    this.type = data.type
    this.url = data.url
  }

  /**
   * @param {SourceURL} original
   * @return {Object}
   */
  updatedEntries (original) {
    const updated = {}

    if (this.type !== original.type) updated.type = this.type

    if (this.url !== original.url) updated.url = this.url

    return updated
  }
}
