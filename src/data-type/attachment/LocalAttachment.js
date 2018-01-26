import { Attachment } from './Attachment'

/**
 * @property {?string} type
 * @property {?number} ratio
 * @property {?string} displayUrl
 * @property {?string} storageUri
 */
export class LocalAttachment extends Attachment {
  /**
   * @param {?string} type
   * @param {?number} ratio
   * @param {?string} displayUrl
   * @param {?string} storageUri
   */
  constructor (type, ratio, displayUrl, storageUri) {
    super(type, ratio)
    this.displayUrl = displayUrl
    this.storageUri = storageUri
  }

  static empty () {
    return new LocalAttachment(null, null, null, null)
  }

  static fromJson (value) {
    const attachment = Attachment.fromJson(value)
    if (attachment === null) {
      return null
    }
    return new LocalAttachment(attachment.type, attachment.ratio, value.displayUrl, value.storageUri)
  }

  /**
   * @param {LocalAttachment} origin
   * @return {Object}
   */
  updateValues (origin) {
    const data = super.updateValues(origin)
    if (this.displayUrl !== origin.displayUrl) {
      data['displayUrl'] = this.displayUrl
    }
    if (this.storageUri !== origin.storageUri) {
      data['storageUri'] = this.storageUri
    }
    return data
  }
}
