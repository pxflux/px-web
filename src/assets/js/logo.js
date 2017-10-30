/* eslint-disable no-trailing-spaces */
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
 *  colorString: string
 *  }} Pixel
 */

/**
 * @param {string} imgPath
 * @param {string} canvasID
 * @param {ScalableCanvasFromImageOptions} options
 * @constructor
 */
function ScalableCanvasFromImage (imgPath, canvasID, options) {
  const _this = this
  options = new ScalableCanvasFromImageOptions(options)

  const pixDensity = window.devicePixelRatio || 1
  const canvas = document.getElementById(canvasID)
  const ctx = canvas.getContext('2d')

  const gradient = options.gradient  // new Gradient([bgColor.offset(45, 100)]);
  let gradientPosition = 0
  const gradientStep = 0.05
  let pixels

  this.pixSize = 0
  this.start = function () {
    pixels = new ImgPixels(imgPath)
    pixels.readPixels(function () {
      setLogoCanvasSize(options.width)
      _this.draw()
    })
  }

  window.addEventListener('resize', function () {
    if (!options.width || options.width <= 1) {
      setLogoCanvasSize(options.width)
      if (!options.animate) _this.draw()
    }
  })

  this.draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const pixSize = _this.pixSize // -1;
    const colorWidth = 1 / pixels.width
    for (let y = 0; y < pixels.height; y++) {
      const pxY = pixSize * y

      for (let x = 0; x < pixels.width; x++) {
        const pxX = pixSize * x
        const px = pixels.pixTable[ x ][ y ]
        if (px.a === 0) continue
        if (options.gradient) {
          let pxLum = px.lum

          if (pxLum > 0.999) {
            if (!options.withBackground) continue
            pxLum = 1 - (Math.random() * 0.02)
          }
          const grPosition = (x * colorWidth + y * colorWidth * 0.2 + gradientPosition)
          ctx.fillStyle = gradient.getValue(grPosition, 1 - pxLum * options.alphaFactor)
        } else {
          ctx.fillStyle = px.colorString
        }
        ctx.fillRect(pxX, pxY, pixSize, pixSize)
      }
    }

    if (options.stroke) {
      ctx.strokeStyle = options.strokeColor.toRGBAString(0.3)
      ctx.lineWidth = 0.5

      for (let sY = 0; sY < pixels.height; sY++) {
        const yy = sY * pixSize + 0.5
        ctx.beginPath()
        ctx.moveTo(0, yy)
        ctx.lineTo(canvas.width, yy)
        ctx.stroke()
      }
      for (let sX = 0; sX < pixels.width; sX++) {
        const xx = sX * pixSize + 0.5
        ctx.beginPath()
        ctx.moveTo(xx, 0)
        ctx.lineTo(xx, canvas.height)
        ctx.stroke()
      }
    }

    if (options.animate) {
      gradientPosition = (gradientPosition + gradientStep)

      setTimeout(function () {
        requestAnimationFrame(_this.draw)
      }, 100)
    }
  }

  function setLogoCanvasSize (desiredWidth) {
    if (!desiredWidth) desiredWidth = 1
    const parent = canvas.parentElement
    const style = window.getComputedStyle(parent, null)
    const paddingLeft = parseFloat(style.getPropertyValue('padding-left'))
    const paddingRight = parseFloat(style.getPropertyValue('padding-right'))
    const paddingTop = parseFloat(style.getPropertyValue('padding-top'))
    const paddingBottom = parseFloat(style.getPropertyValue('padding-bottom'))
    const avalibleH = (parent.clientHeight - paddingBottom - paddingTop)

    if (desiredWidth <= 1) {
      desiredWidth = (parent.clientWidth - paddingLeft - paddingRight) * desiredWidth
    }

    _this.pixSize = Math.floor(desiredWidth / pixels.width)

    let h = _this.pixSize * pixels.height
    if (h > avalibleH) {
      _this.pixSize = Math.floor(avalibleH / pixels.height)
      h = _this.pixSize * pixels.height
    }
    const w = _this.pixSize * pixels.width
    canvas.width = w * pixDensity
    canvas.height = h * pixDensity

    _this.pixSize = Math.round(_this.pixSize * pixDensity)
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
  }
}

/**
 * @param {string} imgScr
 * @constructor
 */
function ImgPixels (imgScr) {
  let _this = this

  /** @type {Pixel[]} */
  // this.pixels = []
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
    console.log(img)
  }

  /**
   * @param {CanvasPixelArray} imageData
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

      let color = new Color(pix.r, pix.g, pix.b, true)
      pix.colorString = color.toRGBAString(pix.a)
      let x = pixIndex % _this.width
      if (typeof _this.pixTable[x] === 'undefined') _this.pixTable[x] = []
      _this.pixTable[x].push(pix)
      pixIndex++
    }
    return pixels

    function normalize (n, max) {
      // Handle floating point rounding errors
      if ((Math.abs(n - max) < 0.000001)) return 1
      return (n % max) / parseFloat(max)
    }
  }
}

/**
 * @param {ScalableCanvasFromImageOptions=} options
 * @constructor
 */
function ScalableCanvasFromImageOptions (options) {
  /** @type number */
  this.width = options.hasOwnProperty('width') ? options.width : 1

  /** @type Gradient */
  this.gradient = options.hasOwnProperty('gradient') ? options.gradient : null

  /** @type boolean */
  this.animate = options.hasOwnProperty('animate') ? options.animate : false

  /** @type boolean */
  this.stroke = options.hasOwnProperty('stroke') ? options.stroke : false

  /** @type boolean */
  this.withBackground = options.hasOwnProperty('withBackground') ? options.withBackground : false

  /** @type Color */
  this.strokeColor = options.hasOwnProperty('strokeColor') ? options.strokeColor : new Color(50)

  /** @type number */
  this.alphaFactor = options.hasOwnProperty('alphaFactor') ? options.alphaFactor : 1
}

export default ScalableCanvasFromImage
