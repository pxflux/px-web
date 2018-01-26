import { AttachmentLink } from './AttachmentLink'

/**
 * @property {?string} type
 * @property {?AttachmentLink} attachmentUrl
 * @property {?number} ratio
 */
export class Attachment {
  /**
   * @param {?string} type
   * @param {?AttachmentLink} link
   * @param {?string} caption
   * @param {?number} ratio
   */
  constructor (type, link, caption, ratio) {
    this.type = type
    this.link = link
    this.caption = caption
    this.ratio = ratio
  }

  static empty () {
    return new Attachment(null, AttachmentLink.empty(), '', null)
  }

  /**
   * @return {?Attachment}
   */
  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Attachment(
      value.type,
      value.caption,
      AttachmentLink.fromJson(value.link),
      value.caption,
      value.ratio
    )
  }

  /**
   * @param {Attachment} origin
   * @return {Object}
   */
  updateValues (origin) {
    const data = {}
    if (this.type !== origin.type) {
      data['type'] = this.type
    }
    if (this.caption !== origin.caption) {
      data['caption'] = this.caption
    }
    if (this.link !== origin.link) {
      data['link'] = this.link.updateValues(origin.link)
    }
    if (this.ratio !== origin.ratio) {
      data['ratio'] = this.ratio
    }
    return data
  }
}
