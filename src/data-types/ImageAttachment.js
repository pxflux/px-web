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
   * @param {?AttachmentStorage} link
   * @param {?string} caption
   * @param {?number} ratio
   */
  constructor (link, caption, ratio) {
    super('image', link, caption, ratio)
  }

  static empty () {
    return new ImageAttachment(AttachmentStorage.empty(), '', null)
  }

  static fromJson (value) {
    const attachment = Attachment.fromJson(value)
    if (attachment === null) {
      return this.empty()
    }
    return new ImageAttachment(attachment.link, attachment.caption, attachment.ratio)
  }
}
