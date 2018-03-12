import { Attachment } from './Attachment'
import { AttachmentStorage } from './AttachmentStorage'

/**
 * @property {?string} type
 * @property {?string} caption
 * @property {?AttachmentStorage} link
 * @property {?number} ratio
 */
export class ImageAttachment extends Attachment {
  /**
   * @param {?AttachmentStorage} storage
   * @param {?string} caption
   * @param {?number} ratio
   */
  constructor (storage, caption, ratio) {
    super('image', storage, caption, ratio)
  }

  /**
   * @return {ImageAttachment}
   */
  static empty () {
    return new ImageAttachment(AttachmentStorage.empty(), '', null)
  }

  /**
   * @param value
   * @return {ImageAttachment}
   */
  static fromJson (value) {
    const attachment = Attachment.fromJson(value)
    if (attachment === null) {
      return this.empty()
    }
    return new ImageAttachment(attachment.storage, attachment.caption, attachment.ratio)
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {ImageAttachment} origin
   */
  updatedImageEntries (prefix, data, origin) {
    super.updatedEntries(prefix, data, origin)
  }
}
