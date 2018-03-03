export class ControlValue {
  constructor (type, keyCode, altKey, ctrlKey, shiftKey, metaKey) {
    this.type = type
    this.keyCode = keyCode
    this.altKey = altKey
    this.ctrlKey = ctrlKey
    this.shiftKey = shiftKey
    this.metaKey = metaKey
  }

  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new ControlValue(value.type, value.keyCode, value.altKey, value.ctrlKey, value.shiftKey, value.metaKey)
  }

  /**
   * @return {Object}
   */
  updatedEntries () {
    return {
      'type': this.type,
      'keyCode': this.keyCode,
      'altKey': this.altKey,
      'ctrlKey': this.ctrlKey,
      'shiftKey': this.shiftKey,
      'metaKey': this.metaKey
    }
  }
}

export class Control {
  /**
   * @param order
   * @param icon
   * @param label
   * @param type
   * @param {ControlValue} value
   */
  constructor (order, icon, label, type, value) {
    this.order = order
    this.icon = icon // Unicode Character or Attachment TODO: it should be of type Icon
    this.label = label
    this.type = type // 'keyboard'|'mouse'|'function'|'custom'
    this.value = value
  }

  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Control(value.order, value.icon, value.label, value.type, ControlValue.fromJson(value.value))
  }

  /**
   * @return {Object}
   */
  updatedEntries () {
    return {
      'order': this.order,
      'icon': this.icon,
      'label': this.label,
      'type': this.type,
      'value': this.value.updatedEntries()
    }
  }
}

export class Controls {
  static fromJson (value) {
    if (Array.isArray(value)) {
      return value.map(it => ControlValue.fromJson(it))
    } else {
      return []
    }
  }
}
