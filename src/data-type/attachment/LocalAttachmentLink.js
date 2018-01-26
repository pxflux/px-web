import { AttachmentLink } from './AttachmentLink'

/**
 * @property {?string} displayUrl
 * @property {?string} storageUri
 */
export class LocalAttachmentStorage extends AttachmentLink {
  /**
   * @param {?string} displayUrl
   * @param {?string} storageUri
   */
  constructor (displayUrl, storageUri) {
    super(displayUrl)
    this.storageUri = storageUri
  }

  static empty () {
    return new LocalAttachmentStorage(null, null)
  }
}
