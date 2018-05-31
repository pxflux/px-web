import { AWVideoResolution } from './AWVideoResolution'

/**
 * @property {number} id
 * @property {string} type - any, monitor, projection, handheld, headset
 * @property {AWVideoResolution} resolution
 * @property {string} orientation - landscape, portrait
 */
export class AWVideoOutput {
  /**
   * @param {number} id
   * @param {string} type
   * @param {AWVideoResolution} resolution
   * @param {string} orientation
   */
  constructor (id, type, resolution, orientation) {
    this.id = isNaN(id) ? 0 : id
    this.type = type
    this.resolution = resolution
    this.orientation = orientation
  }

  static empty () {
    return new AWVideoOutput(0, 'any', AWVideoResolution.empty(), 'landscape')
  }

  /**
   * @param {object} value
   */
  static fromJson (value) {
    if (!value || typeof value !== 'object') {
      return null
    }
    return new AWVideoOutput(Number.parseInt(value.id), value.type, AWVideoResolution.fromJson(value.min), value.orientation)
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'type'] = this.type
    Object.assign(data, this.resolution.toEntries(prefix + 'resolution/'))
    data[prefix + 'orientation'] = this.orientation
    return data
  }

  /**
   * @param {string} prefix
   * @param {object} data
   * @param {AWVideoOutput} from
   */
  updatedEntries (prefix, data, from) {
    const origin = from || AWVideoOutput.empty()
    if (this.type === origin.type) {
      delete data[prefix + 'type']
    }
    this.resolution.updatedEntries(prefix + 'resolution/', data, origin.resolution)
    if (this.orientation === origin.orientation) {
      delete data[prefix + 'orientation']
    }
  }
}

export class AWVideoOutputs {
  /**
   * @return {AWVideoOutput[]}
   */
  static empty () {
    return []
  }

  /**
   * @param value
   * @return {AWVideoOutput[]}
   */
  static fromJson (value) {
    if (!value || typeof value !== 'object') {
      return []
    }
    if (typeof value === 'object') {
      return Object.keys(value).map(key => AWVideoOutput.fromJson(Object.assign(value[key], {id: key})))
    }
    if (Array.isArray(value)) {
      return value.map(it => AWVideoOutput.fromJson(it))
    }
    return []
  }

  /**
   * @param {AWVideoOutput[]} values
   */
  static append (values) {
    const value = Object.assign(AWVideoOutput.empty(), {id: values.length})
    values.push(value)
  }

  /**
   * @param {AWVideoOutput[]} values
   * @param {number} index
   */
  static remove (values, index) {
    values.splice(index, 1)
    for (let i = 0; i < values.length; i++) {
      values[i].id = i
    }
  }

  /**
   * @param {AWVideoOutput[]} videoOutputs
   */
  static toString (videoOutputs) {
    const types = {}
    videoOutputs.forEach(videoOutput => {
      let resolution = videoOutput.resolution.toString()
      if (!types.hasOwnProperty(videoOutput.type)) {
        types[videoOutput.type] = {}
      }
      if (!types[videoOutput.type].hasOwnProperty(resolution)) {
        types[videoOutput.type][resolution] = 0
      }
      types[videoOutput.type][resolution]++
    })
    let result = ''
    for (let type in types) {
      if (!types.hasOwnProperty(type)) {
        continue
      }
      for (let res in type) {
        if (!type.hasOwnProperty(res)) {
          continue
        }
        if (res === 'any') {
          res = ''
        }
        let number = type[res]
        if (type === 'any') {
          type = 'display'
          if (number > 1) {
            type += 's'
          }
          type += ' of any type'
        } else {
          if (number > 1) {
            type += 's'
          }
        }
        if (number === 1) {
          number = 'Single'
        }
        if (result) {
          result += ', '
        }
        result += `${number} ${res} ${type}`
      }
    }
    if (!result) {
      return 'No video'
    }
    return result
  }

  /**
   * @param {string} prefix - '.../setups/'
   * @param {AWVideoOutput[]} values
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
   * @param {AWVideoOutput[]} originals
   * @param {AWVideoOutput[]} values
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
