/**
 * maxim tyminko 29.10.17.
 * maximtyminko.com
 */

import Color from './color'

/**
 * @param {Color[]=} colorList
 */
function Gradient (colorList) {
  /** @type {Color[]} */
  this.colors = colorList || []
  this.numColors = this.colors.length ? this.colors.length : 2
  this.curLocation = 0
  this.shiftStep = 0.02

  if (this.colors.length < 2) {
    let color = this.colors.length ? this.colors[0] : new Color()
    let colors = color.splitComplement()

    let generateLessColors = true
    if (generateLessColors) {
      this.colors = this.colors.concat(colors)
    } else {
      for (let i = 0; i < colors.length; i++) {
        this.colors = this.colors.concat(colors[i].tetrad())
      }
    }
    this.colors.push(color)
  }
  this.step = 1 / (this.colors.length - 1)
}

/**
 * @param {number} position
 * @param {number} alpha
 * @return {string}
 */
Gradient.prototype.getValue = function (position, alpha) {
  position = this.normalize(position)

  const index1 = Math.floor(position / this.step) % this.colors.length
  const index2 = (index1 + 1) % this.colors.length
  const positionInSegment = (position % this.step) / this.step

  return this.mixToRGBAString(this.colors[index1], this.colors[index2], positionInSegment, alpha)
}

Gradient.prototype.generateNextColor = function () {
  const color = this.colors.length ? this.colors[ this.colors.length - 1 ].copy() : new Color()
  this.colors.push(color)
}

/**
 * @param  {Color}  color1
 * @param  {Color}  color2
 * @param  {number} amount
 * @return {{r:number,g:number,b:number}}
 */
Gradient.prototype.mix = function (color1, color2, amount) {
  amount = (amount === 0) ? 0 : (amount || 0.5)

  const rgb1 = color1.rgb
  const rgb2 = color2.rgb

  const p = amount

  return {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b
  }
}
/**
 * @param  {Color}  color1
 * @param  {Color}  color2
 * @param  {number} amount
 * @param  {number=} alpha
 * @return {string}
 */
Gradient.prototype.mixToRGBAString = function (color1, color2, amount, alpha) {
  const rgb = this.mix(color1, color2, amount)

  const r = Math.round(rgb.r * 255)
  const g = Math.round(rgb.g * 255)
  const b = Math.round(rgb.b * 255)
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
}

/**
 * @param {number} n
 * @return {number}
 */
Gradient.prototype.normalize = function (n) {
  if (n > 2) n /= 100
  // Handle floating point rounding errors
  if ((Math.abs(n - 1) < 0.000001)) return 1
  return n % 2 // return reminder, if n bigger then 1 (cycling)
}
export default Gradient
