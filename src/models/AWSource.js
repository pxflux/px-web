import axios from 'axios'
import vimeo from './utilities/vimeo'
import { Resolution } from './basic/Resolution'
import { ImageAttachment } from './ImageAttachment'
import { AttachmentStorage } from './AttachmentStorage'

/**
 * @property {?string}     url
 * @property {?string}     type - 'html' | 'vimeo' | 'video' | 'audio' | 'pd' | 'processing' | etc.
 * @property {?string}     version
 * @property {?boolean}    local - If the source is stored locally on the pxFlux server
 * @property {?string[]}   dependencies - If applicable (e.g. for Javascript), an array of external libraries, frameworks or services
 * @property {?string[]}   assets - If applicable (e.g. for HTML or Javascript), an array of external (media) files used in the source
 * @property {?number}     dataSize - In bits
 * @property {?number}     dataRate - Or bit rate
 * @property {?Resolution} resolution
 * @property {?number}     duration
 * @property {?boolean}    loop - Whether the source is the loop
 * @property {?number}     fps - If applicable (e.g. for Video) frame per second
 * @property {?number}     pixelAspectRatio - If applicable (e.g. for Video) frame per second
 * @property {?number}     colorDepth
 * @property {?string}     colorProfile
 * @property {?string}     codec
 * @property {?number}     videoChannelCount
 * @property {?number}     audioChannelCount
 * @property {?ImageAttachment} thumbnail
 */
export class AWSource {
  /**
   * @param {object=} data
   */
  constructor (data) {
    this.url = null
    this.type = null
    this.version = null
    this.local = null
    this.dependencies = null
    this.assets = null
    this.dataSize = null
    this.dataRate = null
    this.resolution = null
    this.duration = null
    this.loop = null
    this.fps = null
    this.pixelAspectRatio = null
    this.colorDepth = null
    this.colorProfile = null
    this.codec = null
    this.videoChannelCount = null
    this.audioChannelCount = null
    this.thumbnail = null

    if (data) {
      this.fromJson(data)
    }
  }

  /**
   * @param {string} url
   * @param {function=} callbackFunc
   */
  updateUrl (url, callbackFunc) {
    if (typeof callbackFunc !== 'function') callbackFunc = null
    if (vimeo.isVimeoVideoUrl(url)) {
      vimeo.getVimeoVideoInfo(url).then(/** @type VimeoVideoInfo */ vimeoInfo => {
        console.log(vimeoInfo)
        this.clearData()
        this.url = url
        this.type = 'vimeo'
        this.local = false
        this.resolution = new Resolution({ w: vimeoInfo.width, h: vimeoInfo.height })
        this.duration = vimeoInfo.duration
        this.thumbnail = new ImageAttachment(0,
          new AttachmentStorage(vimeoInfo.thumbnail.url, null, null),
          vimeoInfo.description,
          vimeoInfo.thumbnail.width / vimeoInfo.thumbnail.height)
        this.pixelAspectRatio = 1
        if (callbackFunc) callbackFunc(true)
      })
    } else {
      const requestUrl = 'https://50artistsnet.ipage.com/url-to-headers/index.php?url=' + encodeURIComponent(this.url)
      axios.post(requestUrl).then((response) => {
        console.log(response)
        if (typeof response.data === 'object' && response.data.hasOwnProperty('Content-Type')) {
          this.clearData()
          this.url = url
          this.local = false
          this.type = response.data['Content-Type']
          this.pixelAspectRatio = 1
          if (callbackFunc) callbackFunc(true)
        } else {
          this.clearData()
          if (callbackFunc) callbackFunc(false)
        }
      })
    }
  }

  toString () {
    if (!this.url) {
      return 'The URL is not valid.'
    } else {
      switch (this.type) {
        case 'vimeo':
          return `Vimeo video ${this.resolution.toString()} | [${this.durationToString(this.duration)}]`
        default:
          const remote = this.local ? '' : 'External link '
          return `${remote}${this.type.toUpperCase()}`
      }
    }
  }

  durationToString (dur) {
    const hours = Math.floor(dur / 3600)
    dur = dur - hours * 3600
    const minutes = Math.floor(dur / 60)
    const seconds = dur - minutes * 60

    return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2)

    function strPadLeft (string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length)
    }
  }

  static empty () {
    return new AWSource()
  }

  clearData () {
    Object.keys(this).forEach(key => { this[key] = null })
  }

  /**
   * @param {object} data
   */
  fromJson (data) {
    if (!data && typeof data !== 'object') return null
    Object.keys(this).forEach(key => {
      switch (key) {
        case 'resolution':
          this.resolution = data.hasOwnProperty('resolution') ? new Resolution(data.resolution) : null
          break
        default:
          this[key] = data[key] || null
      }
    })
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
      } else {
        data[prefix + key] = this[key]
      }
    })
    return data
  }

  /**
   * @param {string} prefix
   * @param {AWSource} data
   * @param {AWSource} original
   */
  updatedEntries (prefix, data, original) {
    Object.keys(this).forEach(key => {
      if (this.propHasFunc('updatedEntries', key)) {
        this[key].updatedEntries(prefix + key + '/', data, original ? original[key] : null)
      } else {
        if (original && this[key] === original[key]) delete data[prefix + key]
      }
    })
  }

  propHasFunc (funcName, prop) {
    return this[prop] !== null && typeof this[prop] === 'object' && typeof this[prop][funcName] === 'function'
  }
}
