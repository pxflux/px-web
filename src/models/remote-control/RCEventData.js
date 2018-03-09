/**
 * pxflux Remote Control KeyboardEvent
 */

/**
 * @property {string} key
 * @property {string} code
 * @property {boolean} repeat
 * @property {boolean} altKey
 * @property {boolean} ctrlKey
 * @property {boolean} metaKey
 * @property {boolean} shiftKey
 * @property {number} keyCode
 * @property {string} which
 */
export class RCKeyboardEventData {
  constructor (data) {
    this.kind = 'keyboard'

    this.key = ''
    this.code = ''
    this.repeat = false
    this.altKey = false
    this.ctrlKey = false
    this.metaKey = false
    this.shiftKey = false
    // thees two are deprecated but we use them as backward comparability
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
    this.keyCode = null
    this.which = ''

    if (data) {
      this.fromJson(data)
    }
  }

  fromJson (data) {
    if (typeof data !== 'object') {
      return null
    }

    this.key = data.key
    this.code = data.code
    this.repeat = data.repeat
    this.altKey = data.altKey
    this.ctrlKey = data.ctrlKey
    this.metaKey = data.metaKey
    this.shiftKey = data.shiftKey
    this.keyCode = data.keyCode
    this.which = data.which
  }

  /**
   * @return {Object}
   */
  updatedEntries (orig) {
    const obj = {}
    for (let prop in this) {
      if (!this.hasOwnProperty(prop)) continue
      if (orig[prop] !== this[prop]) {
        obj[prop] = this[prop]
      }
    }
    obj.type = '' // We should generate the 'type'('keyup','keydown'..) on the remote control using touch event on the button..
    return obj
  }
}

export class RCCustomEventData {
  constructor (data) {
    this.kind = 'custom'
    this.type = '' // name of the event
    this.detail = null // any data passed

    if (data) {
      this.fromJson(data)
    }
  }

  fromJson (data) {
    if (typeof data !== 'object') {
      return null
    }
    this.type = data.type
    this.detail = data.detail
  }

  /**
   * @return {Object}
   */
  updatedEntries () {
    return {
      type: this.type,
      detail: JSON.parse(JSON.stringify(this.detail)) // clone
    }
  }
}
