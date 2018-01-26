import { Attachment } from './Attachment'
import { AttachmentStorage } from './AttachmentStorage'
import { ImageAttachment } from './ImageAttachment'

/**
 * @property {?string} type
 * @property {?AttachmentStorage} link
 * @property {?string} caption
 * @property {?number} ratio
 * @property {number} duration
 * @property {ImageAttachment} thumbnail
 */
export class VideoAttachment extends Attachment {
  /**
   * @param {?AttachmentStorage} link
   * @param {?string} caption
   * @param {?number} ratio
   * @param {number} duration
   * @param {ImageAttachment} thumbnail
   */
  constructor (link, caption, ratio, duration, thumbnail) {
    super('video', link, caption, ratio)
    this.duration = duration
    this.thumbnail = thumbnail
  }

  static empty () {
    return new VideoAttachment(AttachmentStorage.empty(), '', null, 0, ImageAttachment.empty())
  }

  static fromJson (value) {
    const attachment = Attachment.fromJson(value)
    if (attachment === null) {
      return this.empty()
    }
    return new VideoAttachment(
      attachment.link,
      attachment.caption,
      attachment.ratio,
      value.duration,
      ImageAttachment.fromJson(value.thumbnail)
    )
  }

  /**
   * @param {VideoAttachment} origin
   * @return {Object}
   */
  updateValues (origin) {
    const data = super.updateValues(origin)
    if (this.duration !== origin.duration) {
      data['duration'] = this.duration
    }
    if (this.thumbnail !== origin.thumbnail) {
      data['thumbnail'] = this.thumbnail.updateValues(origin.thumbnail)
    }
    return data
  }
}
