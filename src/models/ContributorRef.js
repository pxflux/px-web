/**
 * @property {?string} id
 * @property {?string} displayName
 * @property {?string} role
 */

export class ContributorRef {
  /**
   * @param {?string} id
   * @param {?string} displayName
   * @param {?string} role
   */
  constructor (id, displayName, role) {
    this.id = id
    this.displayName = displayName
    this.role = role
  }

  /**
   * @return {ContributorRef}
   */
  static empty () {
    return new ContributorRef(null, null, null)
  }

  /**
   * @param value
   * @return {ContributorRef}
   */
  static fromJson (value) {
    return new ContributorRef(value.id, value.displayName, value.role)
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'displayName'] = this.displayName
    data[prefix + 'role'] = this.role
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {ContributorRef} original
   */
  updatedEntries (prefix, data, original) {
    if (this.displayName === original.displayName) {
      delete data[prefix + 'displayName']
    }
    if (this.role === original.role) {
      delete data[prefix + 'role']
    }
  }
}

export class ContributorRefs {
  /**
   * @return {ContributorRef[]}
   */
  static empty () {
    return []
  }

  /**
   * @param value
   * @return {ContributorRef[]}
   */
  static fromJson (value) {
    if (typeof value === 'object') {
      return Object.keys(value).map(key => ContributorRef.fromJson(Object.assign(value[key], {id: key})))
    }
    if (Array.isArray(value)) {
      return value.map(it => ContributorRef.fromJson(it))
    }
    return []
  }

  /**
   * @param {string} prefix
   * @param {ContributorRef[]} values
   * @return {Object}
   */
  static toEntries (prefix, values) {
    const data = {}
    values.forEach(value => {
      Object.assign(data, value.toEntries(prefix + '/' + value.id + '/'))
    })
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {ContributorRef[]} originals
   * @param {ContributorRef[]} values
   */
  static updatedEntries (prefix, data, originals, values) {
    values.forEach(value => {
      const items = originals.filter(item => item.id === value.id)
      const original = items.length > 0 ? items[0] : ContributorRef.empty()
      value.updatedEntries(prefix, data, original)
    })
  }
}
