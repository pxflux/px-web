/**
 * maxim 17/01/2017.
 */
import Color from './color'

/**
 * @typedef {{
 *  r : number,
 *  g : number,
 *  b : number,
 *  a : number,
 *  lum : number,
 *  color: Color,
 *  colorString: string
 *  }} Pixel
 */
/**
 * @param {string} imgURL
 * @param {string} canvasID
 * @param {number} pxSize
 * @constructor
 */
function ScalableCanvasFromImage (imgURL, canvasID, pxSize) {
  const pixDensity = window.devicePixelRatio || 1
  const canvas = document.getElementById(canvasID)
  const ctx = canvas.getContext('2d')

  let modelPixels

  this.sPX = pxSize

  this.logoTopSpx = 0
  this.logoLeftSpx = 0
  this.logoH = 0

  this.setup = function () {
    modelPixels = new ImgPixels(imgURL)
    modelPixels.readPixels(() => {
      setLogoCanvasSize()
      this.draw()
      this.logoH = modelPixels.height
    })
  }

  /**
   * @param {number} pxSize
   */
  this.setPxSize = (pxSize) => {
    this.sPX = pxSize
    setLogoCanvasSize()
    this.draw()
  }

  this.draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const pixSize = this.sPX * pixDensity
    for (let y = 0; y < modelPixels.height; y++) {
      const pxY = pixSize * y

      for (let x = modelPixels.width - 1; x >= 0; x--) {
        const pxX = pixSize * x
        const px = modelPixels.pixTable[x][y]
        if (px.a === 0) {
          continue
        }

        // ctx.fillStyle = px.lum > 0.999 ? px.colorString : options.mainColor.toRGBAString(px.a)
        ctx.fillStyle = px.r === 255 && px.g === 255 && px.b === 255
          ? 'hsla(142, 100%, 50%, ' + (px.a / 255) + ')'
          : 'hsla(180, 100%, 0%, ' + (px.a / 255) + ')'

        ctx.fillRect(pxX, pxY, pixSize, pixSize)
      }
    }
  }

  const setLogoCanvasSize = () => {
    const cssW = modelPixels.width * this.sPX
    const cssH = modelPixels.height * this.sPX

    canvas.width = cssW * pixDensity
    canvas.height = cssH * pixDensity

    canvas.style.width = cssW + 'px'
    canvas.style.height = cssH + 'px'
  }
}

/**
 * @param {string} imgScr
 * @constructor
 */
function ImgPixels (imgScr) {
  let _this = this

  /** @type {Pixel[][]} */
  this.pixTable = []
  this.width = 0
  this.height = 0

  /**
   * @param {function} callback
   */
  this.readPixels = function (callback) {
    let img = new Image()
    img.addEventListener('load', function () {
      _this.width = img.width
      _this.height = img.height

      let canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)

      let pxData = ctx.getImageData(0, 0, img.width, img.height).data
      _this.pixels = collectPixels(pxData)
      callback()
    })

    img.src = imgScr
  }

  /**
   * @param {ImageData} imageData
   * @return {Pixel[]}
   */
  function collectPixels (imageData) {
    /** @type {Pixel[]} */
    let pixels = []
    let pixIndex = 0
    for (let i = 0; i < imageData.length; i += 4) {
      /** @type {Pixel} */
      let pix = {
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
        a: imageData[i + 3]
      }
      let max, min
      max = Math.max(pix.r, pix.g, pix.b)
      min = Math.min(pix.r, pix.g, pix.b)
      pix.lum = normalize((max + min) / 2, 255)
      pixels.push(pix)

      pix.color = new Color(pix.r, pix.g, pix.b, true)
      pix.colorString = pix.color.toRGBAString(pix.a)
      let x = pixIndex % _this.width
      if (typeof _this.pixTable[x] === 'undefined') {
        _this.pixTable[x] = []
      }
      _this.pixTable[x].push(pix)
      pixIndex++
    }
    return pixels

    function normalize (n, max) {
      // Handle floating point rounding errors
      if ((Math.abs(n - max) < 0.000001)) {
        return 1
      }
      return (n % max) / parseFloat(max)
    }
  }
}

export default ScalableCanvasFromImage
