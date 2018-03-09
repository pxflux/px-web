import { ContributorRefs } from './ContributorRef'
import { Setups } from './Setup'
import { Controls } from './Control'
import { cleanEntries } from './CleanEntries'

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
    this.year = year
    this.description = description
    this.setups = setups
    this.controls = controls
    this.version = version
  }

  static empty () {
    return new Artwork(false, null, [], [], null, null, Setups.empty(), [], null)
  }

  /**
   * @param {object} value
   */
  static fromJson (value) {
    if (typeof value !== 'object') {
      return null
    }
    return new Artwork(value.published, value.title, ContributorRefs.fromJson(value.artists),
      ContributorRefs.fromJson(value.credits), value.year, value.description, Setups.fromJson(value.setups),
      Controls.fromJson(value.controls), value.version)
  }

  /**
   * @param {Artwork} original
   * @return {Object}
   */
  updatedEntries (original) {
    const data = {}
    if (this.published !== original.published) {
      data.published = this.published
    }
    if (this.title !== original.title) {
      data.title = this.title
    }
    data.artists = ContributorRefs.updatedEntries(this.artists)
    data.credits = ContributorRefs.updatedEntries(this.credits)
    if (this.year !== original.year) {
      data.year = this.year
    }
    if (this.description !== original.description) {
      data.description = this.description
    }
    data.setups = Setups.updatedEntries(original.setups, this.setups)
    data.controls = this.controls.map(value => value.updatedEntries())

    return cleanEntries(data)
  }
}
