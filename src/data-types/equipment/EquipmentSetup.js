import { ListOfType } from '../ListOfType'
import { Equipment } from './Equipment'
import { PlaybackEquipment } from './PlaybackEquipment'
import { AudioEquipment } from './AudioEquipment'
import { VideoEquipment } from './VideoEquipment'

export class EquipmentSetup {
  /**
   * @param {object=} jsonData
   */
  constructor (jsonData) {
    this.displaysLayout = {}
    this.speakersLayout = {}
    this.video = new ListOfType(VideoEquipment)
    this.audio = new ListOfType(AudioEquipment)
    this.playback = new ListOfType(PlaybackEquipment)
    this.other = new ListOfType(Equipment)

    if (typeof jsonData === 'object') {
      this.fromJson(jsonData)
    }
  }

  /**
   * @param {object} data
   */
  fromJson (data) {
    if (typeof data !== 'object') return
    this.video.fromJson(data.video)
  }

  /**
   * @param {SourceURL} original
   * @return {Object}
   */
  updatedEntries (original) {
    const updated = {}
    if (this.type !== original.type) updated.type = this.type
    if (this.url !== original.url) updated.url = this.url

    return updated
  }
}
