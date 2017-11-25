/* eslint-disable valid-typeof */
import { isNumeric } from '../helper'

export function BasicData () {}

/**
 * @param {object} obj
 * @param {function=} elementConstructor
 * @return {void}
 */
BasicData.prototype.castFrom = function (obj, elementConstructor) {
  if (typeof obj !== 'object') return
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
      const value = obj[prop]
      let defaultValue = this[prop]
      const type = typeof defaultValue
      if (Array.isArray(defaultValue) && typeof value === 'object') {
        // defaultValue = defaultValue[0]
        // let valueArray = []
        // for(let el in value){
        //   if(value.hasOwnProperty(el))
        // }
      }
      if (typeof value === 'object' && typeof defaultValue.castFrom === 'function') {
        defaultValue.castFrom(value)
      } else {
        if (typeof value === type) this[prop] = value
        if (type === 'number' && isNumeric(value)) this[prop] = value * 1
        if (type === 'boolean') this[prop] = this.convertToBoolean(value, defaultValue)
      }
    }
  }
}
BasicData.prototype.convertToBoolean = function (value, defaultValue) {
  return (value === 'true' || value === '1') || (value === 'false' || value === '0') ? false : defaultValue
}

BasicData.prototype.convertToArrayOfType = function (obj) {

}

export function AttachmentData (data) {
  BasicData.call(this)

  this.displayUrl = ''
  this.storageUri = ''
  this.type = '' // image|video|file|...
  this.ratio = 0 // 1.7777777778 - 16:9

  this.castFrom(data)
}

AttachmentData.prototype = BasicData.prototype
AttachmentData.prototype.constructor = AttachmentData

/**
 * @typedef {{
   *   displayUrl: string
   *   storageUri: string
   *   type: string
   *   ratio: number
   *   type: 'video',
   *   thumbnail: AttachmentData,
   *   duration: number
   * }} AttachmentVideoData
 */
/**
 * @param {object=} data
 * @constructor
 */
export function AttachmentVideoData (data) {
  AttachmentData.call(this)

  this.type = 'video'
  this.thumbnail = new AttachmentData()
  this.duration = 0

  this.castFrom(data)
}

AttachmentVideoData.prototype = AttachmentData.prototype
AttachmentVideoData.prototype.constructor = AttachmentVideoData

/**
 * @typedef {string} Url
 */
/**
 * @param {object=} data
 * @constructor
 * @extends BasicData
 */
export class BasicUser extends BasicData {
  constructor (data) {
    super()

    /** @type  string */
    this.id = this.getValueFrom(data, 'id', '')

    /** @type  string */
    this.fullName = this.getValueFrom(data, 'fullName', '')
  }
}

/**
 * @param {object=} data
 * @constructor
 * @extends BasicUser
 */
export function Contributor (data) {
  /** @type  string */
  this.id = ''

  /** @type  string */
  this.fullName = ''

  /** @type  string */
  this.role = ''

  this.image = new AttachmentData()

  this.hasMainRole = function () {
    return this.constructor.roles.indexOf(this.role) === 0
  }

  this.hasImportantRole = function () {
    return this.constructor.roles.indexOf(this.role) < 2
  }

  this.roles = [
    'artist',
    'interpreter',
    'artistAssistant',
    'curator',
    'exhibitionDesigner',
    'mediaTechnician',
    'conservator',
    'registrar',
    'fabricator',
    'art handler',
    'externalCompany',
    'other'
  ]
}

/**
 * @param {object} obj
 * @return {void}
 */
Contributor.prototype.castFrom = function (obj) {
  if (typeof obj !== 'object') return
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
      const value = obj[prop]
      const defaultValue = this[prop]
      if (Array.isArray(defaultValue)) {}
      if (typeof value === typeof defaultValue) this[prop] = value
      if (typeof defaultValue === 'number' && isNumeric(value)) return value * 1
      return defaultValue
    }
  }
}

/**
 * @param {object=} data
 * @constructor
 * @extends Contributor
 */
export class ArtworkContributor extends Contributor {
  constructor (data) {
    super(data)

    /** @type  string */
    this.role = this.getValueFrom(data, 'role', ArtworkContributor.roles[0])
  }

  static get roles () {
    return [
      'artist',
      'interpreter',
      'artistAssistant',
      'curator',
      'exhibitionDesigner',
      'mediaTechnician',
      'conservator',
      'registrar',
      'fabricator',
      'art handler',
      'externalCompany',
      'other'
    ]
  }
}

export class ArrayOfType extends Array {
  /**
   * @parameter {...castFrom} - An object whose properties will be casted to the given type and set into an Array,
   *                            Or number of objects, which will be casted to the given type and set into an Array..
   */
  constructor (castFrom) {
    super()
    this.DataType = BasicData
    if (arguments.length) this.setup(arguments)
  }

  /**
   * @param {Arguments} args
   */
  setup (args) {
    if (args.length) {
      const argsArr = this.convertArgumentsToArray(args)
      for (let i = 0; i < argsArr.length; i++) { this.push(argsArr[i]) }
    }
  }

  /**
   * @param {*} thing
   */
  push (thing) {
    const objectOfType = thing instanceof this.DataType ? thing : new this.DataType(thing)
    super.push(objectOfType)
  }

  /**
   * @param {Arguments} args
   * @return {Array}
   */
  convertArgumentsToArray (args) {
    let ar = []
    if (args.length === 1 && typeof args[0] === 'object') {
      const arg = args[0]
      for (let prop in arg) {
        if (!arg.hasOwnProperty(prop)) continue
        arg[prop]['.key'] = prop
        ar.push(arg[prop])
      }
    } else if (args.length > 1) {
      ar = [...args]
    }
    return ar
  }
}

export class ContributorsList extends Array {
  constructor () {
    super()
    const args = [...arguments]
    args.forEach(function (obj) {
      this.push(new Contributor(obj))
    })
  }

  toString (rank) {
    let rankedContributors = []
    for (let i = 0; i < this.length; i++) {
      const contributor = this[i]
      if (contributor.constructor.roles.indexOf(contributor.role) < rank) {
        rankedContributors.push(contributor.fullName)
      }
    }
    if (rankedContributors.length > 2) return rankedContributors.join(', ')
    if (rankedContributors.length) return rankedContributors.join(' & ')
    return ''
  }
}

/**
 * An Array, which makes sure that all it's items are of type ArtworkContributor
 */
export class ArtworkContributorsList extends ArrayOfType {
  constructor () {
    super()

    this.DataType = ArtworkContributor
    const argsArr = this.convertArgumentsToArray(arguments)
    for (let i = 0; i < argsArr.length; i++) { this.push(argsArr[i]) }
  }

  rankedList (rank) {
    if (!rank) rank = this.length
    let rankedContributors = []
    for (let i = 0; i < this.length; i++) {
      const contributor = this[i]
      if (ArtworkContributor.roles.indexOf(contributor.role) < rank) {
        rankedContributors.push(contributor.fullName)
      }
    }
    return rankedContributors
  }

  toStringWithRank (rank) {
    let rankedContributors = this.rankedList(rank)
    if (rankedContributors.length > 2) return rankedContributors.join(', ')
    if (rankedContributors.length) return rankedContributors.join(' & ')
    return ''
  }
}
