import { SourceURL } from './SourceURL'
import { EquipmentSetup } from './equipment/EquipmentSetup'

export class ArtworkConfiguration {
  constructor (data) {
    /** @type {string} */
    this.name = '' // three screens
    this.type = '' // installation
    this.description = '' // bla bla bla
    this.notes = [] // [bla] [bla-la]
    this.sourceUrl = new SourceURL()
    this.numberScreens = 0 // 3
    this.numberAudioChannels = 0
    this.equipmentSetup = new EquipmentSetup()

    // documentation: {
    //   images: Attachment[]
    //   video: Attachment[]
    //   technicalDrawings: Attachment[]
    //   notes: Note[]
    //   artistInterview: Note
    //   assistantInterview: Note
    //   other: Attachment[]
    // },

    if (data) {
      this.fromJson(data)
    }
  }

  fromJson (data) {
    if (typeof data !== 'object') return
    this.name = data.name
    this.type = data.type
    this.description = data.description
    this.sourceUrl = data.sourceUrl
    this.numberScreens = data.numberScreens
    this.numberAudioChannels = data.numberAudioChannels
    this.screensLayout = data.screensLayout
    this.equipmentSetup = data.equipmentSetup
  }

  updatedEntries (original) {
    const updated = {}
    const primitiveProps = [
      'name',
      'type',
      'description',
      'numberScreens',
      'numberAudioChannels'
    ]
    primitiveProps.forEach(prop => {
      if (this[prop] !== original[prop]) {
        updated[prop] = this[prop]
      }
    })
    const dataTypeProps = [
      'sourceUrl',
      'screensLayout',
      'equipmentSetup'
    ]
    dataTypeProps.forEach(prop => {
      const propUpdatedEntries = this[prop].updatedEntries(original[prop])
      if (Object.keys(propUpdatedEntries).length) {
        updated[prop] = propUpdatedEntries
      }
    })

    return updated
  }
}
