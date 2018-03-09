import { SourceURL } from './SourceURL'
import { VideoAttachment } from './VideoAttachment'
import { ImageAttachment } from './ImageAttachment'
import { cleanEntries } from './CleanEntries'

export class Setup {
  /**
   * @param order
   * @param title
   * @param {SourceURL} source
   * @param {ImageAttachment} thumbnail
   * @param {VideoAttachment} preview
   */
  constructor (order, title, source, thumbnail, preview) {
    this.order = order
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
    return new Setup(value.order, value.title, SourceURL.fromJson(value.source),
      ImageAttachment.fromJson(value.thumbnail), VideoAttachment.fromJson(value.preview))
  }

  /**
   * @return {Object}
   */
  updatedEntries (original) {
    const data = {}
    if (this.order !== original.order) {
      data.order = this.order
    }
    if (this.title !== original.title) {
      data.title = this.title
    } else if (this.title === null) {
      data.title = 'Simple'
    }
    data.source = this.source.updatedEntries(original.source)
    data.thumbnail = this.thumbnail.updatedEntries(original.thumbnail)
    data.preview = this.preview.updatedEntries(original.preview)

    return cleanEntries(data)
  }
}

export class Setups {
  static empty () {
    return [Setup.empty()]
  }

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
   * @param {Setup[]} originals
   * @param {Setup[]} values
   * @return {Object}
   */
  static updatedEntries (originals, values) {
    return values.map(value => {
      const data = originals.filter(setup => setup.order === value.order)
      const original = data.length > 0 ? data[0] : Setup.empty()
      return value.updatedEntries(original)
    }).filter(_ => _ !== null)
  }
}
