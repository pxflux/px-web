/**
 * @property {?string} displayUrl
 * @property {?string} storageUrl
 * @property {?File} file
 */
export class AttachmentStorage {
  /**
   * @param {?string=} displayUrl
   * @param {?string=} storageUrl
   * @param {?File=} file
   */
  constructor (displayUrl, storageUrl, file) {
    this.displayUrl = displayUrl || null
    this.storageUrl = storageUrl || null
    this.file = file || null
  }

  static empty () {
    return new AttachmentStorage(null, null, null)
  }

  /**
   * @return {?AttachmentStorage}
   */
  static fromJson (value) {
    if (!value || typeof value !== 'object') {
      return null
    }
    return new AttachmentStorage(value.displayUrl, value.storageUrl, null)
  }

  /**
   * @param {string} prefix - '.../setups/{index}/thumbnails/{index}/storage/'
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'displayUrl'] = this.displayUrl
    data[prefix + 'storageUrl'] = this.storageUrl
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {AttachmentStorage} origin
   */
  updatedEntries (prefix, data, origin) {
    if (origin && this.displayUrl === origin.displayUrl) {
      delete data[prefix + 'displayUrl']
    }
    if (origin && this.storageUrl === origin.storageUrl) {
      delete data[prefix + 'storageUrl']
    }
  }
}
