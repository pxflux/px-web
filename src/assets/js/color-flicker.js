/**
 * maxim tyminko 31.10.17.
 * maximtyminko.com
 */

import Perlin from './perlin'
import Color from './color'

/**
 * @param {number=} saturation
 * @constructor
 */
function ColorFlicker (saturation) {
  const sat = typeof saturation === 'undefined' ? 100 : saturation
  /**
   * @param {HTMLElement=} el
   */
  this.flickElement = function (el) {
    if (!el) {
      const flickers = document.getElementsByClassName('flick')
      for (let i = 0; i < flickers.length; i++) {
        new StroboscopeBG(flickers[ i ]).draw()
      }
    } else {
      new StroboscopeBG(el).draw()
    }
  }

  function StroboscopeBG (flickEl) {
    const perlin = new Perlin()
    const el = flickEl
    let perlinOffset = Math.random() * 10000
    this.draw = () => {
      const h = (perlin.noise(perlinOffset) * 720 + 180) % 360
      const l = perlin.noise(0, perlinOffset) * 10 + 90
      const color = new Color(h, sat, l)
      el.style.backgroundColor = color.toRGBString()
      perlinOffset += Math.random() * 0.05
      requestAnimationFrame(this.draw)
    }
  }
}
export default ColorFlicker
