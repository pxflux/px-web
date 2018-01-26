/**
 * @property {?string} displayUrl
 */
export class AttachmentLink {
  /**
   * @param {?string} displayUrl
   */
  constructor (displayUrl) {
    this.displayUrl = displayUrl
  }

  static empty () {
    return new AttachmentLink(null)
  }

  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new AttachmentLink(value.displayUrl)
  }

  /**
   * @param {AttachmentLink} origin
   * @return {Object}
   */
  updateValues (origin) {
    const data = {}
    if (this.displayUrl !== origin.displayUrl) {
      data['displayUrl'] = this.displayUrl
    }
    return data
  }
}
