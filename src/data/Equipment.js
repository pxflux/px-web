import { IterationComponent } from './IterationComponent'
import { Dimensions } from './Dimensions'

export class Equipment extends IterationComponent {
  /**
   * @param {Date} created
   * @param {Date} modified
   * @param {Contributor} author
   * @param {string} text
   * @param {string} type
   * @param {string} why
   * @param {Contributor} decidedBy
   * @param {string} status
   * @param {Dimensions} dimensions
   * @param {string} appearance
   * @param {number} weight
   */
  constructor (created, modified, author, text, type, why, decidedBy, status, dimensions, appearance, weight) {
    super(created, modified, author, text, type, why, decidedBy, status)
    this.dimensions = dimensions
    this.appearance = appearance
    this.weight = weight
  }

  static fromJson (value) {
    const parent = IterationComponent.fromJson(value)
    if (parent === null) {
      return null
    }
    return new Equipment(parent.created, parent.modified, parent.author, parent.text, parent.type, parent.why,
      parent.decidedBy, parent.status, Dimensions.fromJson(value.dimensions), value.appearance, value.weight)
  }
}
