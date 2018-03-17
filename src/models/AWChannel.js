import { AWSource } from './AWSource'
import { ArrayOfType } from './utilities/ArrayOfType'

/**
 * @property {number} id
 * @property {?AWSource} source
 * @property {object[]} audioOutputs
 * @property {object[]} videoOutputs
 * @property {boolean} sync
 * @property {boolean} isClockSource
 * @property {?number} syncToChannel
 */
export class AWChannel {
  /**
   * @param {object=} data
   */
  constructor (data) {
    this.id = Date.now()
    this.source = null
    this.audioOutputs = []
    this.videoOutputs = []
    this.sync = false
    this.isClockSource = false
    this.syncToChannel = null

    if (data) {
      this.fromJson(data)
    }
  }

  static empty () {
    return new AWChannel()
  }

  clearData () {
    Object.keys(this).forEach(key => {
      this[key] = Array.isArray(this[key]) ? [] : null
    })
  }

  /**
   * @param {object} data
   */
  fromJson (data) {
    if (typeof data !== 'object' || data === null) return null
    if (data.hasOwnProperty('id')) this.id = data.id
    this.source = new AWSource(data.source)
    this.audioOutputs = ArrayOfType.fromJson(data.audioOutputs, null) // todo instead of null mast be a constructor
    this.videoOutputs = ArrayOfType.fromJson(data.videoOutputs, null) // todo instead of null mast be a constructor
    this.sync = data.sync || false
    this.isClockSource = data.isClockSource || false
    this.syncToChannel = data.syncToChannel || null
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    Object.keys(this).forEach(key => {
      if (this.propHasFunc('toEntries', key)) {
        Object.assign(data, this[key].toEntries(prefix + key + '/'))
      } else if (Array.isArray(this[key])) {
        Object.assign(data, ArrayOfType.toEntries(prefix + 'setups/', this[key]))
      } else {
        data[prefix + key] = this[key]
      }
    })
    return data
  }

  /**
   * @param {string} prefix
   * @param {object} data
   * @param {object} original
   */
  updatedEntries (prefix, data, original) {
    console.log('CHANNELLLLLLLL --> original: >>>>>>')
    console.log(original)
    Object.keys(this).forEach(key => {
      if (this.propHasFunc('updatedEntries', key)) {
        this[key].updatedEntries(prefix + key + '/', data, original[key])
      } else if (Array.isArray(this[key])) {
        ArrayOfType.updatedEntries(prefix + key + '/', data, original[key], this[key])
      } else {
        if (this[key] === original[key]) delete data[prefix + key]
      }
    })
  }

  /**
   * @param {string} funcName
   * @param {string} key
   * @return {boolean}
   */
  propHasFunc (funcName, key) {
    return this[key] !== null && typeof this[key] === 'object' && typeof this[key][funcName] === 'function'
  }
}
