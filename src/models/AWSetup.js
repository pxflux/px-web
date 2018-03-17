import { ArrayOfType } from './utilities/ArrayOfType'
import { AWChannel } from './AWChannel'
import { VideoAttachment } from './VideoAttachment'
import { ImageAttachments } from './ImageAttachment'
// import { EquipmentSetup } from './equipment/EquipmentSetup'

/**
 * @property {number} order
 * @property {?string} title
 * @property {AWChannel[]} channels
 * @property {?ImageAttachment[]} thumbnails
 * @property {?VideoAttachment} preview
 */
export class AWSetup {
  /**
   * @param {object=} data
   */
  constructor (data) {
    this.order = 0
    this.title = null
    this.channels = [new AWChannel()]
    this.thumbnails = []
    this.preview = null

    // this.description = '' // bla bla bla
    // this.notes = [] // [bla] [bla-la]
    // this.equipmentSetup = new EquipmentSetup()

    if (data) this.fromJson(data)
  }

  static empty () {
    return new AWSetup()
  }

  /**
   * @param {object} data
   */
  fromJson (data) {
    if (!data && typeof data !== 'object') return null

    const n = Number.parseInt(data.order)
    this.order = isNaN(n) ? 0 : n
    this.title = data.title || null
    this.channels = data.channels ? ArrayOfType.fromJson(data.channels, AWChannel) : [new AWChannel()]
    this.thumbnails = ImageAttachments.fromJson(data.thumbnails)
    this.preview = VideoAttachment.fromJson(data.preview)
  }

  /**
   * @param {string} prefix - '.../setups/{index}/'
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'title'] = this.title ? this.title : 'Basic'
    Object.assign(data, ArrayOfType.toEntries(prefix + 'channels/', this.channels))
    Object.assign(data, ImageAttachments.toEntries(prefix + 'thumbnails/', this.thumbnails))
    if (this.preview === null) {
      data[prefix + 'preview'] = null
    } else {
      Object.assign(data, this.preview.toEntries(prefix + 'preview/'))
    }
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {AWSetup} original
   */
  updatedEntries (prefix, data, original) {
    if (this.title === original.title) {
      delete data[prefix + 'title']
    }
    ArrayOfType.updatedEntries(prefix + 'source/', data, original.channels, this.channels)
    ImageAttachments.updatedEntries(prefix + 'thumbnails/', data, original.thumbnails, this.thumbnails)
    if (this.preview !== null) {
      this.preview.updatedEntries(prefix + 'preview/', data, original.preview)
    }
  }
}

export class AWSetups {
  /**
   * @return {AWSetup[]}
   */
  static empty () {
    return [AWSetup.empty()]
  }

  /**
   * @param value
   * @return {AWSetup[]}
   */
  static fromJson (value) {
    if (!value) {
      return []
    }
    if (typeof value === 'object') {
      return Object.keys(value).map(key => new AWSetup(Object.assign(value[key], { order: key })))
    }
    if (Array.isArray(value)) {
      return value.map(it => AWSetup.fromJson(it))
    }
    return []
  }

  /**
   * @param {string} prefix - '.../setups/'
   * @param {AWSetup[]} values
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
   * @param {AWSetup[]} originals
   * @param {AWSetup[]} values
   */
  static updatedEntries (prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const items = originals.filter(item => item.order === value.order)
      const original = items.length > 0 ? items[0] : AWSetup.empty()
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
