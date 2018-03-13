/**
 * @property {?string} id
 * @property {?string} fullName
 * @property {?string} role
 */

export class ContributorRef {
  /**
   * @param {?string} id
   * @param {?string} fullName
   * @param {?string} role
   */
  constructor (id, fullName, role) {
    this.id = id || null
    this.fullName = fullName || null
    this.role = role || null
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
    const id = value.hasOwnProperty('.key') ? value['.key'] : value.id
    return new ContributorRef(id, value.fullName, value.role)
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries (prefix) {
    const data = {}
    data[prefix + 'fullName'] = this.fullName
    data[prefix + 'role'] = this.role
    return data
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {ContributorRef} original
   */
  updatedEntries (prefix, data, original) {
    if (this.fullName === original.fullName) {
      delete data[prefix + 'fullName']
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
      Object.assign(data, value.toEntries(prefix + value.id + '/'))
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
    // add & updates
    values.forEach(value => {
      const items = originals.filter(item => item.id === value.id)
      const original = items.length > 0 ? items[0] : ContributorRef.empty()
      value.updatedEntries(prefix + value.id + '/', data, original)
    })
    // remove
    originals.forEach(original => {
      const items = values.filter(item => item.id === original.id)
      if (items.length === 0) {
        data[prefix + original.id] = null
      }
    })
  }
}
