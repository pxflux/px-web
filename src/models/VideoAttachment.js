import { Attachment } from './Attachment'
import { AttachmentStorage } from './AttachmentStorage'
import { ImageAttachment } from './ImageAttachment'

/**
 * @property {?string} type
 * @property {?AttachmentStorage} storage
 * @property {?string} caption
 * @property {?number} ratio
 * @property {number} duration
 * @property {ImageAttachment} thumbnail
 */
export class VideoAttachment extends Attachment {
  /**
   * @param {?AttachmentStorage} storage
   * @param {?string} caption
   * @param {?number} ratio
   * @param {number} duration
   * @param {ImageAttachment} thumbnail
   */
  constructor (storage, caption, ratio, duration, thumbnail) {
    super('video', storage, caption, ratio)
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
    return new VideoAttachment(attachment.storage, attachment.caption, attachment.ratio, value.duration,
      ImageAttachment.fromJson(value.thumbnail)
    )
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = super.toEntries(prefix)
    data[prefix + 'duration'] = this.duration
    Object.assign(data, this.thumbnail.toEntries(prefix + 'thumbnail/'))
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {VideoAttachment} origin
   */
  updatedEntries (prefix, data, origin) {
    super.updatedEntries(prefix, data, origin)
    if (this.duration === origin.duration) {
      delete data[prefix + 'duration']
    }
    this.thumbnail.updatedImageEntries(prefix + 'thumbnail/', data, origin.thumbnail)
  }
}
