import { Attachment } from './Attachment'
import { AttachmentStorage } from './AttachmentStorage'

/**
 * @property {?string} type
 * @property {?AttachmentStorage} storage
 * @property {?number} ratio
 */
export class ImageAttachment extends Attachment {
  /**
   * @param {?AttachmentStorage} storage
   * @param {?number} ratio
   */
  constructor (storage, ratio) {
    super('image', storage, ratio)
  }

  static empty () {
    return new ImageAttachment(AttachmentStorage.empty(), null)
  }

  static fromJson (value) {
    const attachment = Attachment.fromJson(value)
    if (attachment === null) {
      return this.empty()
    }
    return new ImageAttachment(attachment.storage, attachment.ratio)
  }
}
