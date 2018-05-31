/**
 * @property {number} id
 * @property {string} type - loudspeaker, ...
 * @property {string} channel - left, right
 */
export class AWAudioOutput {
  /**
   * @param {number} id
   * @param {string} type
   * @param {string} channel
   */
  constructor (id, type, channel) {
    this.id = isNaN(id) ? 0 : id
    this.type = type
    this.channel = channel
  }

  static empty () {
    return new AWAudioOutput(0, 'any', 'left')
  }

  /**
   * @param {object} value
   */
  static fromJson (value) {
    if (!value || typeof value !== 'object') {
      return null
    }
    return new AWAudioOutput(Number.parseInt(value.id), value.type, value.channel)
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'type'] = this.type
    data[prefix + 'channel'] = this.channel
    return data
  }

  /**
   * @param {string} prefix
   * @param {object} data
   * @param {AWAudioOutput} from
   */
  updatedEntries (prefix, data, from) {
    const origin = from || AWAudioOutput.empty()
    if (this.type === origin.type) {
      delete data[prefix + 'type']
    }
    if (this.channel === origin.channel) {
      delete data[prefix + 'channel']
    }
  }
}

export class AWAudioOutputs {
  /**
   * @return {AWAudioOutput[]}
   */
  static empty () {
    return []
  }

  /**
   * @param value
   * @return {AWAudioOutput[]}
   */
  static fromJson (value) {
    if (!value || typeof value !== 'object') {
      return []
    }
    if (typeof value === 'object') {
      return Object.keys(value).map(key => AWAudioOutput.fromJson(Object.assign(value[key], {id: key})))
    }
    if (Array.isArray(value)) {
      return value.map(it => AWAudioOutput.fromJson(it))
    }
    return []
  }

  /**
   * @param {AWAudioOutput[]} values
   */
  static append (values) {
    const value = Object.assign(AWAudioOutput.empty(), {id: values.length})
    values.push(value)
  }

  /**
   * @param {AWAudioOutput[]} values
   * @param {number} index
   */
  static remove (values, index) {
    values.splice(index, 1)
    for (let i = 0; i < values.length; i++) {
      values[i].id = i
    }
  }

  /**
   * @param {AWAudioOutput[]} audioOutputs
   */
  static toString (audioOutputs) {
    const length = audioOutputs.length
    switch (length) {
      case 0:
        return 'No sound'
      case 1:
        return 'mono'
      case 2:
        return 'stereo'
      default:
        return `${length} channels`
    }
  }

  /**
   * @param {string} prefix - '.../setups/'
   * @param {AWAudioOutput[]} values
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
   * @param {AWAudioOutput[]} originals
   * @param {AWAudioOutput[]} values
   */
  static updatedEntries (prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const original = originals.find(item => item.id === value.id)
      value.updatedEntries(prefix + value.id + '/', data, original)
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
