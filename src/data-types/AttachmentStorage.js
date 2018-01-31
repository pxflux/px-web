/**
 * @property {?string} displayUrl
 * @property {?string} storageUrl
 * @property {?File} file
 */
export class AttachmentStorage {
  /**
   * @param {?string} displayUrl
   * @param {?string} storageUrl
   * @param {?File} file
   */
  constructor (displayUrl, storageUrl, file) {
    this.displayUrl = displayUrl
    this.storageUrl = storageUrl
    this.file = file
  }

  static empty () {
    return new AttachmentStorage(null, null, null)
  }

  /**
   * @param {AttachmentStorage} origin
   * @return {Object}
   */
  updatedEntries (origin) {
    const data = {}
    if (this.displayUrl !== origin.displayUrl) {
      data['displayUrl'] = this.displayUrl
    }
    if (this.storageUrl !== origin.storageUrl) {
      data['storageUrl'] = this.storageUrl
    }
    return data
  }
}
