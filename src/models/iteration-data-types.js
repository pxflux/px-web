/**
 */

/**
 * @typedef {string} Url
 */
/**
 * @constructor
 */
export function User () {

}

/**
 * @typedef {
 *  {
 *   userId: string,
 *   fullName: string,
 *   role: string,
 *  }
 * } ContributorData
 */
/**
 * @param {ContributorData=} data
 * @constructor
 */
export function Contributor (data) {
  /** @type  string */
  this.userId = getValueFromObj(data, 'userId', '')

  /** @type  string */
  this.fullName = getValueFromObj(data, 'fullName', '')

  /** @type  string */
  this.role = getValueFromObj(data, 'role', '')
}
Contributor.prototype.roleOptions = function () {
  return [
    'Artist',
    'Artist Assistant',
    'Interpreter',
    'Curator',
    'Exhibition Designer',
    'Media Technician',
    'Conservator',
    'Registrar',
    'Fabricator',
    'Art Handler',
    'External Company',
    'Other'
  ]
}

/**
 * @typedef {
 *  {
 *   created: Date,
 *   modified: Date,
 *   author: Contributor,
 *   text: string
 *  }
 * } RecordData
 */
/**
 * @param {RecordData=} data
 * @constructor
 */
export function Record (data) {
  /** @type  Date */
  this.created = getValueFromObj(data, 'created', new Date())

  /** @type  Date */
  this.modified = getValueFromObj(data, 'modified', null)

  /** @type  Contributor */
  this.author = getValueFromObj(data, 'author', null)

  /** @type  string */
  this.text = getValueFromObj(data, 'text', '')

  /** @type {Url[]} */
  this.attachments = getValueFromObj(data, 'attachments', [])
}

/**
 * @typedef {
 *  {
 *   onBehalfOf: Contributor,
 *  }
 * } NoteData
 * @extends RecordData
 */
/**
 * @param {NoteData} data
 * @constructor
 * @extends Record
 */
export function Note (data) {
  setupInheritance(Note, Record, this, data)

  /** @type  Contributor */
  this.onBehalfOf = getValueFromObj(data, 'onBehalfOf', null)
}

/**
 * @typedef {
 *  {
 *   type: string,
 *   why: string,
 *   decidedBy: Contributor
 *  }
 * } IterationComponentData
 * @extends RecordData
 */
/**
 * @param {IterationComponentData=} data
 * @constructor
 * @extends Record
 */
export function IterationComponent (data) {
  setupInheritance(IterationComponent, Record, this, data)

  /** @type  string, */
  this.type = getValueFromObj(data, 'type', '')

  /** @type {string} */
  this.why = getValueFromObj(data, 'why', '')

  /** @type {Contributor} */
  this.decidedBy = getValueFromObj(data, 'decidedBy', null)
}

IterationComponent.prototype.typeOptions = function () {
  return []
}

/**
 * @typedef {
 *  {
 *   dimensions: [number, number, number],
 *   weight: number,
 *   appearance: string,
 *  }
 * } EquipmentData
 * @extends IterationComponentData
 */
/**
 * @param {EquipmentData=} data
 * @constructor
 * @extends IterationComponent
 */
export function Equipment (data) {
  setupInheritance(Equipment, IterationComponent, this, data)

  /** @type  {[number, number, number]} */
  this.dimensions = getValueFromObj(data, 'dimensions', [0, 0, 0])

  /** @type  string */
  this.appearance = getValueFromObj(data, 'appearance', '')

  /** @type  number */
  this.weight = getValueFromObj(data, 'weight', 0)
}

Equipment.prototype.typeOptions = function () {
  return []
}

/**
 * @typedef {
 *  {
 *   sensitivity: string,
 *   frequencyResponse: string,
 *   impedance: number,
 *  }
 * } AudioEquipmentData
 * @extends EquipmentData
 */
/**
 * @param {AudioEquipmentData=} data
 * @constructor
 * @extends Equipment
 */
export function AudioEquipment (data) {
  setupInheritance(AudioEquipment, Equipment, this, data)

  /** @type  string, */
  this.sensitivity = getValueFromObj(data, 'sensitivity', '')

  /** @type  string, */
  this.frequencyResponse = getValueFromObj(data, 'frequencyResponse', '')

  /** @type  number, */
  this.impedance = getValueFromObj(data, 'impedance', 0)
}

AudioEquipment.prototype.typeOptions = function () {
  return ['speaker', 'headphones']
}

/**
 * @typedef {
 *  {
 *   resolution: [number, number],
 *   pixelDensity: number,
 *   brightness: number,
 *   contrastRatio: number,
 *   colorDepth: number,
 *   colorProfile: string,
 *   modes3D: string,
 *   displayType: string
 *   screenDimensions: [number, number],
 *   screenDiagonal: number,
 *   aspectRatio: string,
 *   responseTime: number
 *   lens: {
 *     focalLength: number,
 *     shift: boolean,
 *     throwRatio: number
 *   },
 *   speakers: string,
 *   audibleNoise: number,
 *  }
 * } DisplayEquipmentData
 * @extends EquipmentData
 */
/**
 * @param {DisplayEquipmentData=} data
 * @constructor
 * @extends Equipment
 */
export function DisplayEquipment (data) {
  setupInheritance(DisplayEquipment, Equipment, this, data)

  /** @type {[number, number]} */
  this.resolution = getValueFromObj(data, 'resolution', [0, 0])

  /** @type number */
  this.pixelDensity = getValueFromObj(data, 'pixelDensity', 0)

  /** @type number */
  this.brightness = getValueFromObj(data, 'brightness', 0)

  /** @type number */
  this.contrastRatio = getValueFromObj(data, 'contrastRatio', 0)

  /** @type number */
  this.colorDepth = getValueFromObj(data, 'colorDepth', 0)

  /** @type string */
  this.colorProfile = getValueFromObj(data, 'colorProfile', '')

  /** @type string */
  this.modes3D = getValueFromObj(data, 'modes3D', '')

  /** @type string */
  this.displayType = getValueFromObj(data, 'displayType', '')

  /** @type {[number, number]} */
  this.screenDimensions = getValueFromObj(data, 'screenDimensions', [0, 0])

  /** @type number */
  this.screenDiagonal = getValueFromObj(data, 'screenDiagonal', 0)

  /** @type string */
  this.aspectRatio = getValueFromObj(data, 'aspectRatio', '')

  /** @type number */
  this.responseTime = getValueFromObj(data, 'colorProfile', '')

  /** @type {{focalLength: number, shift: boolean, throwRatio: number}} */
  this.lens = getValueFromObj(data, 'lens', {
    focalLength: 0,
    shift: false,
    throwRatio: 0
  })

  /** @type string */
  this.speakers = getValueFromObj(data, 'speakers', '')

  /** @type number */
  this.audibleNoise = getValueFromObj(data, 'audibleNoise', 0)
}

DisplayEquipment.prototype.typeOptions = function () {
  return ['monitor', 'projector', 'oculus']
}

/**
 * @typedef {
 *  {
 *   processorCores: number,
 *   processorSpeed: number,
 *   processorArchitecture: string,
 *   memoryAmount: number,
 *   memoryType: string,
 *   graphicsMemoryAmount: number,
 *   graphicsMemoryType: string,
 *   storageAmount: string,
 *   storageType: string,
 *   os: string,
 *   osVersion: number,
 *  }
 * } PlaybackEquipmentData
 * @extends EquipmentData
 */
/**
 * @param {DisplayEquipmentData=} data
 * @constructor
 * @extends Equipment
 */
export function PlaybackEquipment (data) {
  setupInheritance(PlaybackEquipment, Equipment, this, data)

  /** @type  number */
  this.processorCores = getValueFromObj(data, 'processorCores', 0)

  /** @type  number */
  this.processorSpeed = getValueFromObj(data, 'processorSpeed', 0)

  /** @type  string */
  this.processorArchitecture = getValueFromObj(data, 'processorArchitecture', '')

  /** @type  number */
  this.memoryAmount = getValueFromObj(data, 'memoryAmount', 0)

  /** @type  string */
  this.memoryType = getValueFromObj(data, 'memoryType', '')

  /** @type  number */
  this.graphicsMemoryAmount = getValueFromObj(data, 'graphicsMemoryAmount', 0)

  /** @type  string */
  this.graphicsMemoryType = getValueFromObj(data, 'graphicsMemoryType', '')

  /** @type  string */
  this.storageAmount = getValueFromObj(data, 'storageAmount', '')

  /** @type  string */
  this.storageType = getValueFromObj(data, 'storageType', '')

  /** @type  string */
  this.os = getValueFromObj(data, 'os', '')

  /** @type  number */
  this.osVersion = getValueFromObj(data, 'osVersion', '')
}

PlaybackEquipment.prototype.typeOptions = function () {
  return ['desktop', 'laptop', 'handheld', 'one board']
}

/**
 * @param {Object} obj
 * @param {string} propName
 * @param {*} defaultValue
 * @return {Object|Array|string|number|boolean}
 */
function getValueFromObj (obj, propName, defaultValue) {
  return obj && obj.hasOwnProperty(propName) ? obj[propName] : defaultValue
}

/**
 * @param {class} thatClass
 * @param {class} parentClass
 * @param {Object} that
 * @param {*} arg
 */
function setupInheritance (thatClass, parentClass, that, arg) {
  parentClass.call(that, arg)
  thatClass.prototype = Object.create(parentClass.prototype)
  thatClass.prototype.constructor = thatClass
}
