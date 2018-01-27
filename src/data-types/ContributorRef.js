/**
 * @property {string} id
 * @property {string} displayName
 */
export class ContributorRef {
  /**
   * @param {string} id
   * @param {string} displayName
   */
  constructor (id, displayName) {
    this.id = id
    this.displayName = displayName
  }

  static fromJson (value) {
    return new ContributorRef(value.id, value.displayName)
  }

  /**
   * @return {Object}
   */
  updateValues () {
    return {
      'displayName': this.displayName
    }
  }
}

export class ContributorRefs {
  /**
   * @param {ContributorRef[]} values
   * @return {Object}
   */
  static updateValues (values) {
    const data = {}
    values.forEach(value => {
      data[value.id] = value.updateValues()
    })
    return data
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
