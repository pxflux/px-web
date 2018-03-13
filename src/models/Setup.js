import { SourceURL } from './SourceURL'
import { VideoAttachment } from './VideoAttachment'
import { ImageAttachment } from './ImageAttachment'

/**
 * @property {number} order
 * @property {?string} title
 * @property {SourceURL} source
 * @property {ImageAttachment} thumbnail
 * @property {VideoAttachment} preview
 */
export class Setup {
  /**
   * @param {number} order
   * @param {?string} title
   * @param {SourceURL} source
   * @param {ImageAttachment} thumbnail
   * @param {VideoAttachment} preview
   */
  constructor (order, title, source, thumbnail, preview) {
    this.order = isNaN(order) ? 0 : order
    this.title = title
    this.source = source
    this.thumbnail = thumbnail
    this.preview = preview
  }

  static empty () {
    return new Setup(0, null, SourceURL.empty(), ImageAttachment.empty(), VideoAttachment.empty())
  }

  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Setup(Number.parseInt(value.order), value.title, SourceURL.fromJson(value.source),
      ImageAttachment.fromJson(value.thumbnail), VideoAttachment.fromJson(value.preview))
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'title'] = this.title ? this.title : 'Simple'
    Object.assign(data, this.source.toEntries(prefix + 'source/'))
    Object.assign(data, this.thumbnail.toEntries(prefix + 'thumbnail/'))
    Object.assign(data, this.preview.toEntries(prefix + 'preview/'))
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Setup} original
   */
  updatedEntries (prefix, data, original) {
    if (this.title === original.title) {
      delete data[prefix + 'title']
    }
    this.source.updatedEntries(prefix + 'source/', data, original.source)
    this.thumbnail.updatedEntries(prefix + 'thumbnail/', data, original.thumbnail)
    this.preview.updatedEntries(prefix + 'preview/', data, original.preview)
  }
}

export class Setups {
  /**
   * @return {Setup[]}
   */
  static empty () {
    return [Setup.empty()]
  }

  /**
   * @param value
   * @return {Setup[]}
   */
  static fromJson (value) {
    if (typeof value === 'object') {
      return Object.keys(value).map(key => Setup.fromJson(Object.assign(value[key], {order: key})))
    }
    if (Array.isArray(value)) {
      return value.map(it => Setup.fromJson(it))
    }
    return []
  }

  /**
   * @param {string} prefix
   * @param {Setup[]} values
   * @return {Object}
   */
  static toEntries (prefix, values) {
    const data = {}
    values.forEach(value => {
      Object.assign(data, value.toEntries(prefix + value.order + '/'))
    })
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Setup[]} originals
   * @param {Setup[]} values
   */
  static updatedEntries (prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const items = originals.filter(item => item.order === value.order)
      const original = items.length > 0 ? items[0] : Setup.empty()
      value.updatedEntries(prefix + value.order + '/', data, original)
    })
    // remove
    originals.forEach(original => {
      const items = values.filter(item => item.order === original.order)
      if (items.length === 0) {
        data[prefix + original.order] = null
      }
    })
  }
}
