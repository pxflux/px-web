import { Controls } from './Control'
import { ArtworkSource } from './ArtworkSource'
import { VideoAttachment } from './VideoAttachment'
import { ContributorRefs } from './ContributorRef'
import { ImageAttachment } from './ImageAttachment'

/**
 * @typedef {Object} Artwork
 * @property {boolean} published
 * @property {?string} title
 * @property {ArtworkSource} source
 * @property {ImageAttachment} thumbnail
 * @property {VideoAttachment} preview
 * @property {ContributorRef[]} artists
 * @property {?string} year
 * @property {?string} description
 * @property {Control[]} controls
 */
export class Artwork {
  /**
   * @param {boolean} published
   * @param {?string} title
   * @param {ArtworkSource} source
   * @param {ImageAttachment} thumbnail
   * @param {VideoAttachment} preview
   * @param {ContributorRef[]} artists
   * @param {?string} year
   * @param {?string} description
   * @param {Control[]} controls
   */
  constructor (published, title, source, thumbnail, preview, artists, year, description, controls) {
    this.published = published
    this.title = title
    this.source = source
    this.thumbnail = thumbnail
    this.preview = preview
    this.artists = artists
    this.year = year
    this.description = description
    this.controls = controls
  }

  static empty () {
    return new Artwork(false, null, ArtworkSource.empty(), ImageAttachment.empty(), VideoAttachment.empty(), [], null, null, [])
  }

  /**
   * @returns {Artwork}
   */
  static fromJson (value) {
    return new Artwork(value.published, value.title,
      ArtworkSource.fromJson(value.source), ImageAttachment.fromJson(value.thumbnail),
      VideoAttachment.fromJson(value.preview), ContributorRefs.fromJson(value.artists),
      value.year, value.description, Controls.fromJson(value.controls))
  }

  /**
   * @param {Artwork} origin
   * @return {Object}
   */
  updateValues (origin) {
    const data = {}
    if (this.published !== origin.published) {
      data['published'] = this.published
    }
    if (this.title !== origin.title) {
      data['title'] = this.title
    }
    if (this.source !== origin.source) {
      data['source'] = this.source.updateValues(origin.source)
    }
    if (this.thumbnail !== origin.thumbnail) {
      data['thumbnail'] = this.thumbnail.updateValues(origin.thumbnail)
    }
    if (this.preview !== origin.preview) {
      data['preview'] = this.preview.updateValues(origin.preview)
    }
    if (this.artists !== origin.artists) {
      data['artists'] = ContributorRefs.updateValues(this.artists)
    }
    if (this.year !== origin.year) {
      data['year'] = this.year
    }
    if (this.description !== origin.description) {
      data['description'] = this.description
    }
    if (this.controls !== origin.controls) {
      data['controls'] = this.controls.map(value => value.updateValues())
    }
    return data
  }
}
