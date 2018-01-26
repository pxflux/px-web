import { LocalAttachment } from './LocalAttachment'

/**
 * @property {string} type
 * @property {?number} ratio
 * @property {?string} displayUrl
 * @property {?string} storageUri
 */
export class ImageLocalAttachment extends LocalAttachment {
  /**
   * @param {?number} ratio
   * @param {?string} displayUrl
   * @param {?string} storageUri
   */
  constructor (ratio, displayUrl, storageUri) {
    super('image', ratio, displayUrl, storageUri)
  }

  static empty () {
    return new ImageLocalAttachment('image', null, null, null)
  }
}
