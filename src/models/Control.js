/**
 * @property {number} order
 * @property {?string} icon
 * @property {?string} label
 * @property {?string} type
 * @property {ControlValue} value
 */
export class Control {
  /**
   * @param {number} order
   * @param {?string} icon
   * @param {?string} label
   * @param {?string} type
   * @param {ControlValue} value
   */
  constructor (order, icon, label, type, value) {
    this.order = isNaN(order) ? 0 : order
    this.icon = icon // Unicode Character or Attachment TODO: it should be of type Icon
    this.label = label
    this.type = type // 'keyboard'|'mouse'|'function'|'custom'
    this.value = value
  }

  /**
   * @return {Control}
   */
  static empty () {
    return new Control(0, null, null, 'keyboard', ControlValue.empty())
  }

  /**
   * @param value
   * @return {?Control}
   */
  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Control(Number.parseInt(value.order), value.icon, value.label, value.type,
      ControlValue.fromJson(value.value))
  }

  /**
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'icon'] = this.icon
    data[prefix + 'label'] = this.label
    data[prefix + 'type'] = this.type
    Object.assign(data, this.value.toEntries(prefix + 'value/'))
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Control} original
   */
  updatedEntries (prefix, data, original) {
    if (this.icon === original.icon) {
      delete data[prefix + 'icon']
    }
    if (this.label === original.label) {
      delete data[prefix + 'label']
    }
    if (this.type === original.type) {
      delete data[prefix + 'type']
    }
    this.value.updatedEntries(prefix + 'value/', data, original.value)
  }
}

export class Controls {
  /**
   * @return {Control[]}
   */
  static empty () {
    return []
  }

  /**
   * @param value
   * @return {Control[]}
   */
  static fromJson (value) {
    if (!value) {
      return []
    }
    if (typeof value === 'object') {
      return Object.keys(value).map(key => Control.fromJson(Object.assign(value[key], {order: key})))
    }
    if (Array.isArray(value)) {
      return value.map(it => Control.fromJson(it))
    }
    return []
  }

  /**
   * @param {string} prefix
   * @param {Control[]} values
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
   * @param {Control[]} originals
   * @param {Control[]} values
   */
  static updatedEntries (prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const items = originals.filter(item => item.order === value.order)
      const original = items.length > 0 ? items[0] : Control.empty()
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

/**
 * @property {?string} type
 * @property {?number} keyCode
 * @property {?boolean} altKey
 * @property {?boolean} ctrlKey
 * @property {?boolean} shiftKey
 * @property {?boolean} metaKey
 */
export class ControlValue {
  /**
   * @param {?string} type
   * @param {?number} keyCode
   * @param {?boolean} altKey
   * @param {?boolean} ctrlKey
   * @param {?boolean} shiftKey
   * @param {?boolean} metaKey
   */
  constructor (type, keyCode, altKey, ctrlKey, shiftKey, metaKey) {
    this.type = type
    this.keyCode = isNaN(keyCode) ? null : keyCode
    this.altKey = altKey
    this.ctrlKey = ctrlKey
    this.shiftKey = shiftKey
    this.metaKey = metaKey
  }

  /**
   * @return {ControlValue}
   */
  static empty () {
    return new ControlValue(null, null, null, null, null, null)
  }

  /**
   * @param value
   * @return {?ControlValue}
   */
  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new ControlValue(value.type, Number.parseInt(value.keyCode), value.altKey, value.ctrlKey, value.shiftKey,
      value.metaKey)
  }

  /**
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'type'] = this.type
    data[prefix + 'keyCode'] = this.keyCode
    data[prefix + 'altKey'] = this.altKey
    data[prefix + 'ctrlKey'] = this.ctrlKey
    data[prefix + 'shiftKey'] = this.shiftKey
    data[prefix + 'metaKey'] = this.metaKey
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {ControlValue} original
   */
  updatedEntries (prefix, data, original) {
    if (this.type === original.type) {
      delete data[prefix + 'type']
    }
    if (this.keyCode === original.keyCode) {
      delete data[prefix + 'keyCode']
    }
    if (this.altKey === original.altKey) {
      delete data[prefix + 'altKey']
    }
    if (this.ctrlKey === original.ctrlKey) {
      delete data[prefix + 'ctrlKey']
    }
    if (this.shiftKey === original.shiftKey) {
      delete data[prefix + 'shiftKey']
    }
    if (this.metaKey === original.metaKey) {
      delete data[prefix + 'metaKey']
    }
  }
}
