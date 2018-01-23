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
   * @param {?number} ratio
   */
  constructor (type, storage, ratio) {
    this.type = type
    this.storage = storage
    this.ratio = ratio
  }

  static empty () {
    return new Attachment(null, AttachmentStorage.empty(), null)
  }

  /**
   * @return {?Attachment}
   */
  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Attachment(value.type, AttachmentStorage.fromJson(value.storage), value.ratio)
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
    if (this.storage !== origin.storage) {
      data['storage'] = this.storage.updateValues(origin.storage)
    }
    if (this.ratio !== origin.ratio) {
      data['ratio'] = this.ratio
    }
    return data
  }
}
