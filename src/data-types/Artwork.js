import { ArtworkSource } from './ArtworkSource'
import { VideoAttachment } from './VideoAttachment'
import { ImageAttachment } from './ImageAttachment'
import { ContributorRefs } from './ContributorRef'
import { Controls } from './Control'

/**
 * @property {boolean} published
 * @property {?string} title
 * @property {ArtworkSource} source
 * @property {ImageAttachment} thumbnail
 * @property {VideoAttachment} preview
 * @property {ContributorRef[]} artists
 * @property {ContributorRef[]} credits
 * @property {?number} year
 * @property {?string} description
 * @property {Control[]} controls
 */
export class Artwork {
  constructor (jsonData) {
    this.published = false
    this.title = ''
    this.source = ArtworkSource.empty()
    this.thumbnail = ImageAttachment.empty()
    this.preview = VideoAttachment.empty()
    this.artists = []
    this.credits = []
    this.year = null
    this.description = ''
    this.controls = []

    if (typeof jsonData === 'object') {
      this.fromJson(jsonData)
    }
  }

  fromJson (value) {
    this.published = value.published
    this.title = value.title
    this.source = ArtworkSource.fromJson(value.source)
    this.thumbnail = ImageAttachment.fromJson(value.thumbnail)
    this.preview = VideoAttachment.fromJson(value.preview)
    this.artists = ContributorRefs.fromJson(value.artists)
    this.credits = ContributorRefs.fromJson(value.credits)
    this.year = value.year
    this.description = value.description
    this.controls = Controls.fromJson(value.controls)
  }

  /**
   * @param {Artwork} origin
   * @return {Object}
   */
  updatedEntries (origin) {
    const data = {}

    if (this.published !== origin.published) {
      data.published = this.published
    }
    if (this.title !== origin.title) {
      data.title = this.title
    }

    data.source = this.source.updatedEntries(origin.source)

    data.thumbnail = this.thumbnail.updatedEntries(origin.thumbnail)

    data.preview = this.preview.updatedEntries(origin.preview)

    data.artists = ContributorRefs.updatedEntries(this.artists)

    data.credits = ContributorRefs.updatedEntries(this.credits)

    if (this.year !== origin.year) {
      data.year = this.year
    }

    if (this.description !== origin.description) {
      data.description = this.description
    }

    data.controls = this.controls.map(value => value.updatedEntries())

    return data
  }
}
