import { ContributorRefs } from './ContributorRef'
import { Setups } from './Setup'
import { Controls } from './Control'

/**
 * @property {boolean} published
 * @property {?string} title
 * @property {ContributorRef[]} artists
 * @property {ContributorRef[]} credits
 * @property {?number} year
 * @property {?string} description
 * @property {Setup[]} setups
 * @property {Control[]} controls
 * @property {?string} version
 */
export class Artwork {
  constructor (published, title, artists, credits, year, description, setups, controls, version) {
    this.published = published
    this.title = title
    this.artists = artists
    this.credits = credits
    this.year = isNaN(year) ? 0 : year
    this.description = description
    this.setups = setups
    this.controls = controls
    this.version = version
  }

  static empty () {
    return new Artwork(false, null, ContributorRefs.empty(), ContributorRefs.empty(), 0, null, Setups.empty(),
      Controls.empty(), null)
  }

  /**
   * @param {object} value
   */
  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Artwork(value.published, value.title, ContributorRefs.fromJson(value.artists),
      ContributorRefs.fromJson(value.credits), Number.parseInt(value.year), value.description,
      Setups.fromJson(value.setups), Controls.fromJson(value.controls), value.version)
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'published'] = this.published
    data[prefix + 'title'] = this.title
    Object.assign(data, ContributorRefs.toEntries(prefix + 'artists/', this.artists))
    Object.assign(data, ContributorRefs.toEntries(prefix + 'credits/', this.credits))
    data[prefix + 'year'] = this.year
    data[prefix + 'description'] = this.description
    Object.assign(data, Setups.toEntries(prefix + 'setups/', this.setups))
    Object.assign(data, Controls.toEntries(prefix + 'controls/', this.controls))
    return data
  }

  /**
   * @param {string} prefix
   * @param {Artwork} original
   * @return {Object}
   */
  toUpdates (prefix, original) {
    const data = this.toEntries(prefix)
    this.updatedEntries(prefix, data, original)
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Artwork} original
   */
  updatedEntries (prefix, data, original) {
    if (this.published === original.published) {
      delete data[prefix + 'published']
    }
    if (this.title === original.title) {
      delete data[prefix + 'title']
    }
    ContributorRefs.updatedEntries(prefix + 'artists/', data, original.artists, this.artists)
    ContributorRefs.updatedEntries(prefix + 'credits/', data, original.credits, this.credits)
    if (this.year === original.year) {
      delete data[prefix + 'year']
    }
    if (this.description === original.description) {
      delete data[prefix + 'description']
    }
    Setups.updatedEntries(prefix + 'setups/', data, original.setups, this.setups)
    Controls.updatedEntries(prefix + 'controls/', data, original.controls, this.controls)
  }
}
