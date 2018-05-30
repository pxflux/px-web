import { AWSource } from './AWSource'
import { ArrayOfType } from './utilities/ArrayOfType'

/**
 * @property {number} id
 * @property {?AWSource} source
 * @property {object[]} audioOutputs
 * @property {object[]} videoOutputs
 * @property {boolean} sync
 * @property {boolean} isClockSource
 * @property {number} syncToChannel
 */
export class AWChannel {
  /**
   * @param {number} id
   * @param {?AWSource} source
   * @param {object[]} audioOutputs
   * @param {object[]} videoOutputs
   * @param {boolean} sync
   * @param {boolean} isClockSource
   * @param {number} syncToChannel
   */
  constructor (id, source, audioOutputs, videoOutputs, sync, isClockSource, syncToChannel) {
    this.id = isNaN(id) ? 0 : id
    this.source = source || null
    this.audioOutputs = audioOutputs || []
    this.videoOutputs = videoOutputs || []
    this.sync = sync || false
    this.isClockSource = isClockSource || false
    this.syncToChannel = isNaN(syncToChannel) ? 0 : syncToChannel
  }

  static empty () {
    return new AWChannel(0, null, [], [], false, false, 0)
  }

  /**
   * @param {object} value
   */
  static fromJson (value) {
    if (!value || typeof value !== 'object') {
      return null
    }
    return new AWChannel(Number.parseInt(value.id), AWSource.fromJson(value.source), ArrayOfType.fromJson(value.audioOutputs, null),
      ArrayOfType.fromJson(value.videoOutputs, null), value.sync, value.isClockSource, Number.parseInt(value.syncToChannel))
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    if (this.source === null) {
      data[prefix + 'source'] = null
    } else {
      Object.assign(data, this.source.toEntries(prefix + 'source/'))
    }
    data[prefix + 'audioOutputs'] = this.audioOutputs
    data[prefix + 'videoOutputs'] = this.videoOutputs
    data[prefix + 'sync'] = this.sync
    data[prefix + 'isClockSource'] = this.isClockSource
    data[prefix + 'syncToChannel'] = this.syncToChannel
    return data
  }

  /**
   * @param {string} prefix
   * @param {object} data
   * @param {AWChannel} from
   */
  updatedEntries (prefix, data, from) {
    const origin = from || AWChannel.empty()
    if (this.source !== null) {
      this.source.updatedEntries(prefix + 'source/', data, origin.source)
    }
    if (this.audioOutputs === origin.audioOutputs) {
      delete data[prefix + 'audioOutputs']
    }
    if (this.videoOutputs === origin.videoOutputs) {
      delete data[prefix + 'videoOutputs']
    }
    if (this.sync === origin.sync) {
      delete data[prefix + 'sync']
    }
    if (this.isClockSource === origin.isClockSource) {
      delete data[prefix + 'isClockSource']
    }
    if (this.syncToChannel === origin.syncToChannel) {
      delete data[prefix + 'syncToChannel']
    }
  }
}

export class AWChannels {
  /**
   * @return {AWChannel[]}
   */
  static empty () {
    return []
  }

  /**
   * @param value
   * @return {AWChannel[]}
   */
  static fromJson (value) {
    if (!value || typeof value !== 'object') {
      return []
    }
    if (typeof value === 'object') {
      return Object.keys(value).map(key => AWChannel.fromJson(Object.assign(value[key], {id: key})))
    }
    if (Array.isArray(value)) {
      return value.map(it => AWChannel.fromJson(it))
    }
    return []
  }

  /**
   * @param {AWChannel[]} values
   */
  static append (values) {
    const value = Object.assign(AWChannel.empty(), {id: values.length})
    values.push(value)
  }

  /**
   * @param {AWChannel[]} values
   * @param {number} index
   */
  static remove (values, index) {
    values.splice(index, 1)
    for (let i = 0; i < values.length; i++) {
      values[i].id = i
    }
  }

  /**
   * @param {string} prefix - '.../setups/'
   * @param {AWChannel[]} values
   * @return {Object}
   */
  static toEntries (prefix, values) {
    const data = {}
    values.forEach(value => {
      Object.assign(data, value.toEntries(prefix + value.id + '/'))
    })
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {AWChannel[]} originals
   * @param {AWChannel[]} values
   */
  static updatedEntries (prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const original = originals.find(item => item.id === value.id)
      value.updatedEntries(prefix + value.id + '/', data, original || AWChannel.empty())
    })
    // remove
    originals.forEach(original => {
      const items = values.filter(item => item.id === original.id)
      if (items.length === 0) {
        data[prefix + original.id] = null
      }
    })
  }
}
