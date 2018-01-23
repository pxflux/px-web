/**
 * @property {?string} displayUrl
 */
export class AttachmentStorage {
  /**
   * @param {?string} displayUrl
   */
  constructor (displayUrl) {
    this.displayUrl = displayUrl
  }

  static empty () {
    return new AttachmentStorage(null)
  }

  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new AttachmentStorage(value.displayUrl)
  }

  /**
   * @param {AttachmentStorage} origin
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
