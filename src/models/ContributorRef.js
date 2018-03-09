/**
 * @property {string} id
 * @property {string} displayName
 */
import { cleanEntries } from './CleanEntries'

export class ContributorRef {
  /**
   * @param {string} id
   * @param {string} displayName
   * @param {string} role
   */
  constructor (id, displayName, role) {
    this.id = id
    this.displayName = displayName
    this.role = role
  }

  static fromJson (value) {
    return new ContributorRef(value.id, value.displayName, value.role)
  }

  /**
   * @return {Object}
   */
  updatedEntries () {
    const data = {
      displayName: this.displayName,
      role: this.role
    }
    return cleanEntries(data)
  }
}

export class ContributorRefs {
  /**
   * @param {ContributorRef[]} values
   * @return {Object}
   */
  static updatedEntries (values) {
    const data = {}
    values.forEach(value => {
      data[value.id] = value.updatedEntries()
    })
    return cleanEntries(data)
  }

  /**
   * @returns {ContributorRef[]}
   */
  static fromJson (value) {
    if (typeof value === 'object') {
      return Object.keys(value).map(key => new ContributorRef(key, value[key].fullName))
    } else {
      return []
    }
  }
}
