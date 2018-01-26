import { Attachment } from './Attachment'
import { AttachmentLink } from './AttachmentLink'

/**
 * @property {?string} type
 * @property {?AttachmentLink} link
 * @property {?number} ratio
 */
export class ImageAttachment extends Attachment {
  /**
   * @param {?AttachmentLink} link
   * @param {?string} caption
   * @param {?number} ratio
   */
  constructor (link, caption, ratio) {
    super('image', link, caption, ratio)
  }

  static empty () {
    return new ImageAttachment(AttachmentLink.empty(), '', null)
  }

  static fromJson (value) {
    const attachment = Attachment.fromJson(value)
    if (attachment === null) {
      return this.empty()
    }
    return new ImageAttachment(attachment.link, attachment.caption, attachment.ratio)
  }
}
