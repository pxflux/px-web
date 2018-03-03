import { AttachmentStorage } from './AttachmentStorage'

/**
 * @property {?string} type
 * @property {?AttachmentStorage} storage
 * @property {?number} ratio
 */
export class Attachment {
  /**
   * @param {?string} type
   * @param {?AttachmentStorage} storage
   * @param {?string} caption
   * @param {?number} ratio
   */
  constructor (type, storage, caption, ratio) {
    this.type = type
    this.storage = storage
    this.caption = caption
    this.ratio = ratio
  }

  static empty () {
    return new Attachment(null, AttachmentStorage.empty(), null, null)
  }

  /**
   * @return {?Attachment}
   */
  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Attachment(value.type, new AttachmentStorage(value.displayUrl, value.storageUrl), value.caption, value.ratio)
  }

  /**
   * @param {Attachment} origin
   * @return {Object}
   */
  updatedEntries (origin) {
    const data = {}
    if (this.type !== origin.type) {
      data['type'] = this.type
    }
    if (this.storage !== origin.storage) {
      data['storage'] = this.storage.updatedEntries(origin.storage)
    }
    if (this.caption !== origin.caption) {
      data['caption'] = this.caption
    }
    if (this.ratio !== origin.ratio) {
      data['ratio'] = this.ratio
    }
    return data
  }
}
