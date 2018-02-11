import { SourceURL } from './SourceURL'
import { VideoAttachment } from './VideoAttachment'
import { ImageAttachment } from './ImageAttachment'
import { ContributorRefs } from './ContributorRef'
import { Controls } from './Control'

/**
 * @property {boolean} published
 * @property {?string} title
 * @property {SourceURL} source
 * @property {ImageAttachment} thumbnail
 * @property {VideoAttachment} preview
 * @property {ContributorRef[]} artists
 * @property {ContributorRef[]} credits
 * @property {?number} year
 * @property {?string} description
 * @property {Control[]} controls
 */
export class Artwork {
  /**
   * @param {object=} jsonData
   */
  constructor (jsonData) {
    this.published = false
    this.title = ''
    this.artists = []
    this.credits = []
    this.year = null
    this.description = ''
    this.source = new SourceURL()
    this.thumbnail = ImageAttachment.empty()
    this.preview = VideoAttachment.empty()
    this.controls = []

    /** @type {?string} - Artwork version */
    this.version = ''

    /** @type {object} - Catalog of project files --> reference to build-in git repository? */
    this.sourceFiles = null

    if (typeof jsonData === 'object') {
      this.fromJson(jsonData)
    }
  }

  /**
   * @param {object} obj
   */
  fromJson (obj) {
    this.published = obj.published
    this.title = obj.title
    this.artists = ContributorRefs.fromJson(obj.artists)
    this.credits = ContributorRefs.fromJson(obj.credits)
    this.year = obj.year
    this.source.fromJson(obj.source)
    this.thumbnail = ImageAttachment.fromJson(obj.thumbnail)
    this.preview = VideoAttachment.fromJson(obj.preview)
    this.description = obj.description
    this.controls = Controls.fromJson(obj.controls)
  }

  /**
   * @param {Artwork} original
   * @return {Object}
   */
  updatedEntries (original) {
    const updated = {}

    if (this.published !== original.published) {
      updated.published = this.published
    }
    if (this.title !== original.title) {
      updated.title = this.title
    }

    updated.source = this.source.updatedEntries(original.source)

    updated.thumbnail = this.thumbnail.updatedEntries(original.thumbnail)

    updated.preview = this.preview.updatedEntries(original.preview)

    updated.artists = ContributorRefs.updatedEntries(this.artists)

    updated.credits = ContributorRefs.updatedEntries(this.credits)

    if (this.year !== original.year) {
      updated.year = this.year
    }

    if (this.description !== original.description) {
      updated.description = this.description
    }

    updated.controls = this.controls.map(value => value.updatedEntries())

    return updated
  }
}
