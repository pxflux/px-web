/* eslint-disable no-trailing-spaces,no-multi-spaces,key-spacing */

/**
 * @typedef {
 *  {
 *   type: string,
 *   value: *,
 *  }
 * } FieldData
 */
/**
 * @typedef {
 *  {
 *   userId: string,
 *   fullName: string,
 *   role: string,
 *  }
 * } Contributor
 * @typedef {Contributor[]} Contributors
 */
/**
 * @typedef {
 *  {
 *   date: Date,
 *   author: User,
 *   text: string
 *  }
 * } Comment
 * @typedef {Comment[]} Comments
 */
/**
 * @typedef {
 *  {
 *   date: Date,
 *   dateModified: Date,
 *   author: Contributor,
 *   onBehalfOf: Contributor,
 *   text: string
 *  }
 * } Note
 * @typedef {Note[]} Notes
 */
/**
 * @typedef {
 *  {
 *   date: Date,
 *   valueType: string,
 *   value: *,
 *   attachment: string,
 *   decisionMaking: string,
 *   decidedBy: Contributor
 *  }
 * } IterationComponent
 * @typedef {IterationComponent[]} IterationComponentList
 */
/**
 * @typedef {
 *  {
 *   type: 'display'|'projector'|'oculus',
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
 *   dimensions: [number, number, number],
 *   weight: number
 *   lens: {
 *     focalLength: number,
 *     shift: boolean,
 *     throwRatio: number
 *   },
 *   speakers: string,
 *   audibleNoise: number,
 *   appearance: string
 *  }
 * } DisplayEquipment
 * @typedef {DisplayEquipment[]} DisplayEquipmentList
 */

/**
 * @typedef {
 *  {
 *   type: 'speakers'|'headphones',
 *   sensitivity: string,
 *   frequencyResponse: string,
 *   Impedance: number,
 *   dimensions: [number, number, number],
 *   weight: number
 *   appearance: string
 *  }
 * } AudioEquipment
 * @typedef {AudioEquipment[]} AudioEquipmentList
 */
/**
 * @typedef {
 *  {
 *   type: 'computer',
 *   processorCores: number,
 *   processorSpeed: number,
 *   processorArchitecture: string,
 *   memoryAmount: number,
 *   memoryType: string,
 *   graphicsMemoryAmount: number,
 *   graphicsMemoryType: string,
 *   storageAmount: string,
 *   storageType: string,
 *   OS: string,
 *   OSVersion: number,
 *   dimensions: [number, number, number],
 *   weight: number
 *   appearance: string
 *  }
 * } PlaybackEquipment
 * @typedef {PlaybackEquipment[]} PlaybackEquipmentList
 */

export function IterationModel () {
  this.contributorsRoles = [
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
  this.data = {
    id: field('string'),
    title: field('string'),
    thumbUrl: field('url'),
    date: field('date'),
    exhibitions: field('Show[]'),
    contributors: field('Contributor[]'),
    supervisedBy: field('Contributor[]'),
    installation: fieldsGroup({
      installedBy: field('text'),
      withArtist: field('boolean'),
      artistInfluence: field('Note')
    }),
    documentation: fieldsGroup({
      images: field('url[]', []),
      video: field('url[]'),
      technicalDrawings: field('url[]'),
      notes: field('Note[]'),
      artistInterview: field('Note'),
      assistantInterview: field('Note'),
      other: field('url[]')
    }),
    evaluation: fieldsGroup({
      notes: field('Note[]'),
      approvedByArtist: field('boolean'),
      warnings: field('Note[]')
    }),
    comments: field('Comment[]'),
    publications: field('Publication[]'),
    space: fieldsGroup({
      context: field('IterationComponent'),
      floorPlan: field('IterationComponent'),
      dimensions: field('IterationComponent'),
      fakeWalls: field('IterationComponent'),
      ceilingHeight: field('IterationComponent'),
      ceiling: field('IterationComponent'),
      wall: field('IterationComponent'),
      floor: field('IterationComponent'),
      acoustic: field('IterationComponent'),
      lighting: field('IterationComponent'),
      entranceExit: field('IterationComponent'),
      visitorFlow: field('IterationComponent'),
      displayPosition: field('IterationComponent'),
      playerPosition: field('IterationComponent'),
      projectionDistances: field('IterationComponent'),
      screens: field('IterationComponent'),
      imageSize: field('IterationComponent'),
      imagePlacement: field('IterationComponent'),
      projectionSurface: field('IterationComponent')
    }),
    exhibitionCopies: fieldsGroup({ /* we probably don't need this */ }),
    equipment: fieldsGroup({
      visual: field('DisplayEquipmentList'),
      audio: field('AudioEquipmentList'),
      playback: field('PlaybackEquipmentList'),
      other: field('IterationComponentList')
    }),
    otherComponents: field('IterationComponentList'),
    technicalSetup: fieldsGroup({
      looped: field('IterationComponent'),
      timed: field('IterationComponent'),
      synched: field('IterationComponent'),
      controlled: field('IterationComponent'),
      amperageInSpaceAtEquipment: field('IterationComponent'),
      conditionedPower: field('IterationComponent'),
      cabling: field('IterationComponent'),
      settings: field('IterationComponent'),
      other: field('IterationComponent')
    })
  }
  
  this.labels = {
    id: 'ID',
    title: 'Iteration Name',
    thumbUrl: 'Thumbnail URL',
    date: 'Created',
    exhibitions: 'Exhibitions',
    contributors: 'Contributors',
    supervisedBy: ['Supervised By', 'Who had an impact on the appearance of this iteration?'],

    installation: {
      label: 'Installation Notes',
      installedBy: ['Who installed the artwork, for how long?', 'List names, and/or skill-sets, and add the hours/days per person.'],
      withArtist: ['Was the artist present/represented during the (entire) install?', 'boolean'],
      artistInfluence: 'If not, how (closely) did the artist monitor/influence this iteration?'
    },
    documentation: {
      label: 'Documentation',
      images: 'Images, as installed',
      video: 'Video',
      technicalDrawings: 'Technical Drawings',
      notes: 'Notes',
      artistInterview: 'Artist Interview',
      assistantInterview: 'Artist Assistant Interview',
      other: 'Other'
    },
    evaluation: {
      label: 'Evaluation',
      notes: 'Was the iteration considered to be successful, or less successful? Why? (Source, Date)',
      approvedByArtist: 'Did the artist(s) see and/or approve this iteration?',
      warnings: 'Were there any unsolved problems or suggestions for future improvements? (Source, Date)'
    },
    comments: 'Comments',
    publications: 'Publications',
    space: {
      label: 'Space, as installed',
      context: ['Installation context', 'Space dedicated, or shared with other works?'],
      floorPlan: 'Floor plan',
      dimensions: 'Dimensions',
      fakeWalls: 'Fake walls included',
      ceilingHeight: 'Ceiling height',
      ceiling: ['Ceiling color', 'Color, paint [brand, product] etc.'],
      wall: ['Wall surface', 'Color, wallpaper, paint [brand, product] etc.'],
      floor: ['Flooring', 'Native gallery floor, carpet [brand, product] etc.'],
      acoustic: ['Sound level and insulation', 'Sound abatement, sound panels [brand, product] etc.'],
      lighting: ['Light conditions', 'Light level, quality and direction; light insulation, curtains [brand, product] etc.'],
      entranceExit: 'Entrance/exit',
      visitorFlow: 'Visitor flow',
      displayPosition: 'Position and mounting of display equipment (incl. speakers)',
      playerPosition: 'Position and mounting of playback equipment',
      projectionDistances: 'Projection distances',
      screens: ['Screens', 'Size, material [brand, product]'],
      imageSize: 'Size of image',
      imagePlacement: 'Placement of image, elevations',
      projectionSurface: ['Preparation of projection surface', 'reflective paint [brand, product]']
    },
    exhibitionCopies: fieldsGroup({ /* we probably don't need this */ }),
    equipment: {
      label: 'Equipment, as installed',
      visual: 'Monitors/Projectors',
      audio: 'Audio EquipmentList',
      playback: 'Playback EquipmentList',
      other: 'Other'
    },
    otherComponents: ['Other Installation Components, as installed', 'incl. sculptural components, stands, benches, pedestals etc.'],
    technicalSetup: {
      label: 'Technical Set-up',
      looped: 'Looped',
      timed: 'Timed',
      synched: 'Synched',
      controlled: 'Controlled',
      amperageInSpaceAtEquipment: 'Amperage in space/at equipment',
      conditionedPower: 'Conditioned power',
      cabling: 'Cabling',
      settings: 'Settings',
      other: 'Other'
    }
  }
}

/**
 * @param {string=} type | Data type
 * @param {*=} value | Default value or list of other field in case of a filed group
 *
 * @return {FieldData}
 */
function field (type, value) {
  if (!value) {
    if (!type || type === 'string' || type === 'text') {
      value = ''
    } else if (type.substr(-2) === '[]') {
      value = []
    } else {
      value = null
    }
  }
  return {
    type: type || 'string',
    value: value
  }
}

/**
 * @param {Object<string, FieldData>=} fields
 * @return {{name: string, label: string, value: (Object<string, FieldData>), desc: string}}
 */
function fieldsGroup (fields) {
  return {
    type: 'fieldsGroup',
    value: fields || {}
  }
}

export function cloneIteration (iteration) {
  return {
    title: iteration.title
  }
}
