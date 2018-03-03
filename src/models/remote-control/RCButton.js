/**
 * pxflux Remote Control Button
 */

import { RCCustomEventData, RCKeyboardEventData } from './RCEventData'

export class RCButton {
  constructor (data) {
    this.order = 0
    this.icon = '' // Unicode Character or Attachment TODO: it should be of type Icon
    this.label = ''
    this.eventType = '' // 'keyboard'|'mouse'|'function'|'custom'
    /** @type RCKeyboardEventData */
    this.value = null

    if (data) {
      this.fromJson(data)
    }
  }

  fromJson (data) {
    if (typeof data !== 'object') {
      return null
    }
    this.order = data.order
    this.icon = data.icon
    this.label = data.label
    this.eventType = data.eventType
    switch (this.eventType) {
      case 'keyboard':
        this.value = new RCKeyboardEventData(data.value)
        break
      case 'custom':
        this.value = new RCCustomEventData(data.value)
        break
      default:
        this.value = null
    }
  }

  /**
   * @return {Object}
   */
  updatedEntries () {
    return {
      'order': this.order,
      'icon': this.icon,
      'label': this.label,
      'type': this.eventType,
      'eventType': this.eventType,
      'value': this.value.updatedEntries()
    }
  }
}

/**
 * @return {RCButton[]||[]}
 */
export class Buttons {
  static fromJson (data) {
    if (Array.isArray(data)) {
      return data.map(it => new RCButton(it))
    } else {
      return []
    }
  }
}
