/**
 * maxim tyminko 21.10.17.
 * maximtyminko.com
 */

import Color from './color'
import Perlin from './perlin'
import ScalableCanvasFromImage from './logo'

export default (function () {
  window.addEventListener('load', () => {
    /**
     * @param {string} name
     * @param {string=} url
     * @return {null|string}
     */
    function getURLParameterByName (name, url) {
      if (!url) url = window.location.href

      name = name.replace(/[[\]]/g, '\\$&')
      let regex, results
      regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
      results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }

    const playerID = getURLParameterByName('id')
    if (playerID) {
      document.getElementById('id-display').innerHTML = `<div class="desc center">PLAYER ID</div>${playerID}`
    }

    const logoURL = './static/img/pxflux-logo-8.png'
    // const logoBox = document.getElementById('px-logo-box')
    const c = 100
    const bgColor = new Color(c)
    document.getElementsByTagName('body')[0].style.backgroundColor = bgColor.toRGBString()

    /** @type ScalableCanvasFromImageOptions */
    const logoOptions = {
      // width: 200,
      // gradient: new Gradient([new Color(), new Color(), new Color(), new Color()]),
      animate: false,
      stroke: false,
      withBackground: false,
      alphaFactor: 1
      // strokeColor: bgColor.offset(0, 0, -10)
    }
    new ScalableCanvasFromImage(logoURL, 'px-logo', logoOptions).start()

    const flickers = document.getElementsByClassName('flick')
    for (let i = 0; i < flickers.length; i++) {
      new StroboscopeBG(flickers[i]).draw()
    }

    function StroboscopeBG (flickEl) {
      const perlin = new Perlin()
      const el = flickEl
      // const t = 0 // Math.random() * 50
      let perlinOffset = Math.random() * 10000
      this.draw = () => {
        const h = (perlin.noise(perlinOffset) * 720 + 180) % 360
        // const l = perlin.noise(0, perlinOffset) * 10 + 90
        const color = new Color(h, 100, 95)
        el.style.backgroundColor = color.toRGBString()
        perlinOffset += Math.random() * 0.2
        // setTimeout(() => {
        requestAnimationFrame(this.draw)
        // }, t)
      }
    }

    // requestAnimationFrame(StroboscopeBG)
  })
})()
