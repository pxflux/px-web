import { isNumeric } from '../helper'

export class BasicData {}

/**
 * @param {object} obj
 * @param {string} prop
 * @param {*} [defaultValue]
 * @return {*}
 */
BasicData.prototype.getValueFrom = function (obj, prop, defaultValue) {
  if (typeof obj !== 'object') return defaultValue
  if (obj.hasOwnProperty(prop)) {
    const value = obj[prop]
    if (!defaultValue || typeof value === typeof defaultValue) return value
    if (typeof defaultValue === 'number' && isNumeric(value)) return value * 1
    return defaultValue
  }
}

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
export class Contributor extends BasicUser {
  constructor (data) {
    super(data)

    /** @type  string */
    this.role = this.getValueFrom(data, 'role', '')
  }

  get hasMainRole () {
    return this.constructor.roles.indexOf(this.role) === 0
  }

  get hasImportantRole () {
    return this.constructor.roles.indexOf(this.role) < 2
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
