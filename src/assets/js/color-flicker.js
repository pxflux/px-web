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
  let sat = typeof saturation === 'undefined' ? 100 : saturation
  /**
   * @param {HTMLElement=} el
   */
  this.flickElement = function (el) {
    if (!el) {
      const flickers = document.getElementsByClassName('flick')
      for (let i = 0; i < flickers.length; i++) {
        new StroboscopeBG(flickers[i]).draw()
      }
    } else {
      new StroboscopeBG(el).draw()
    }
  }

  function StroboscopeBG (flickEl) {
    const perlin = new Perlin()
    const el = flickEl
    // let perlinOffset = Math.random() * 10000
    let perlinOffsets = [Math.random() * 10000, Math.random() * 10000, Math.random() * 10000]
    let perlinSteps = [Math.random() * 0.01, Math.random() * 0.01, Math.random() * 0.01]
    this.draw = () => {
      const h = (perlin.noise(...perlinOffsets.map(function (a) { return a / 2 })) * 720 + 180) % 360
      const l = perlin.noise(...perlinOffsets) * 18 + 80
      sat = perlin.noise(...perlinOffsets) * 40 + 40
      const color = new Color(h, sat, l)
      el.style.backgroundColor = color.toRGBString()
      // perlinOffset += 0.005
      perlinOffsets = perlinOffsets.map(function (a, i) {
        return a + perlinSteps[i]
      })
     // requestAnimationFrame(this.draw)
    }
  }
}

export default ColorFlicker
