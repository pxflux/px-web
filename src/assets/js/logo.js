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
 * @param {ScalableCanvasFromImageOptions=} options
 * @constructor
 */
function ScalableCanvasFromImage (imgURL, canvasID, options) {
  const _this = this
  options = new ScalableCanvasFromImageOptions(options)

  const pixDensity = window.devicePixelRatio || 1
  const canvas = document.getElementById(canvasID)
  const ctx = canvas.getContext('2d')

  const gradient = options.gradient  // new Gradient([bgColor.offset(45, 100)]);
  let gradientPosition = 0
  const gradientStep = 0.05

  let modelPixels

  this.sPX = 0
  let previousSpx = 0
  let canvasHSpx = 0
  let canvasWSpx = 0
  let logoTopSpx = 0
  let logoLeftSpx = 0
  let gridAlreadyDrawn = false
  let mainColor = true

  this.logoTopSpx = 0
  this.logoLeftSpx = 0
  this.logoH = 0

  // Listen for the event.
  window.addEventListener('changeMainColor', function (e) {
    mainColor = e.detail
    _this.draw()
  })

  if (options.fillParent) {
    // canvas.style.width = '100%'
    // canvas.style.height = '100%'
  }

  this.setup = function (url) {
    if (!url) url = imgURL
    modelPixels = new ImgPixels(url)
    modelPixels.readPixels(function () {
      setLogoCanvasSize(options.width)
      gridAlreadyDrawn = false
      _this.draw()
      _this.logoH = modelPixels.height
    })
  }

  this.draw = function () {
    // let hueOffs = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const pixSize = _this.sPX // -1;
    const colorWidth = 1 / modelPixels.width
    mainColor = new Color(null, 5, 5)

    for (let y = 0; y < modelPixels.height; y++) {
      const pxY = pixSize * (y + logoTopSpx)

      for (let x = 0; x < modelPixels.width; x++) {
        const pxX = pixSize * (x + logoLeftSpx)
        const px = modelPixels.pixTable[x][y]
        if (px.a === 0) {
          continue
        }
        if (options.gradient) {
          let pxLum = px.lum

          if (pxLum > 0.999) {
            if (!options.withBackground) {
              continue
            }
            pxLum = 1 - (Math.random() * 0.02)
          }
          const grPosition = (x * colorWidth + y * colorWidth * 0.2 + gradientPosition)
          ctx.fillStyle = gradient.getValue(grPosition, 1 - pxLum * options.alphaFactor)
        } else {
          let col = ''
          if (options.randomColor) {
            col = px.lum > 0.999 ? px.colorString : new Color(null, 100, 90).toRGBAString(px.a)
            // col = px.color.offset(hueOffs += 0.5 + 180, 50, 50).toRGBAString(px.a)
            if (mainColor) {
              col = px.lum > 0.999 ? px.colorString : options.mainColor.toRGBAString(px.a)
            }
          } else {
            col = px.lum > 0.999 ? px.colorString : options.mainColor.toRGBAString(px.a)
          }
          ctx.fillStyle = col // px.colorString
        }
        ctx.fillRect(pxX, pxY, pixSize, pixSize)
      }
    }

    if (options.stroke && !gridAlreadyDrawn) {
      const a = options.strokeColor.a < 1 ? options.strokeColor.a : 0.05
      ctx.strokeStyle = options.strokeColor.toRGBAString(a)
      ctx.lineWidth = 0.5

      for (let sY = 0; sY < canvasHSpx; sY++) {
        const yy = sY * pixSize + 0.5
        ctx.beginPath()
        ctx.moveTo(0, yy)
        ctx.lineTo(canvas.width, yy)
        ctx.stroke()
      }
      for (let sX = 0; sX < canvasWSpx; sX++) {
        const xx = sX * pixSize + 0.5
        ctx.beginPath()
        ctx.moveTo(xx, 0)
        ctx.lineTo(xx, canvas.height)
        ctx.stroke()
      }
      // gridAlreadyDrawn = true
    }

    if (options.animate) {
      gradientPosition = (gradientPosition + gradientStep)

      setTimeout(function () {
        requestAnimationFrame(_this.draw)
      }, 0)
    }
  }

  function setLogoCanvasSize (desiredWidth) {
    if (!desiredWidth) {
      desiredWidth = 1
    }
    const parent = canvas.parentElement
    const availableH = parent.clientHeight
    if (desiredWidth <= 1) {
      desiredWidth = parent.clientWidth * desiredWidth
    }

    if (options.fillParent) {
      const vW = parent.clientWidth * pixDensity
      const vH = parent.clientHeight * pixDensity

      const module = 48 * pixDensity
      _this.sPX = Math.floor(vW / modelPixels.width)
      _this.sPX = module / Math.ceil(module / _this.sPX)

      canvasWSpx = Math.ceil(vW / _this.sPX)
      canvasHSpx = Math.ceil(vH / _this.sPX)

      logoTopSpx = options.top ? options.top : Math.floor((canvasHSpx - modelPixels.height) / 2 * 0.95)
      _this.logoTopSpx = logoTopSpx

      logoLeftSpx = options.left ? options.left : Math.floor((canvasWSpx - modelPixels.width) / 2)
      _this.logoLeftSpx = logoLeftSpx

      canvas.width = vW
      canvas.height = vH

      canvas.style.width = parent.clientWidth + 'px'
      canvas.style.height = parent.clientHeight + 'px'
    } else {
      _this.sPX = Math.floor(desiredWidth / modelPixels.width)

      let h = _this.sPX * modelPixels.height
      if (h > availableH) {
        _this.sPX = Math.floor(availableH / modelPixels.height)
        h = _this.sPX * modelPixels.height
      }
      const w = _this.sPX * modelPixels.width
      _this.sPX = Math.round(_this.sPX * pixDensity)

      canvas.width = w * pixDensity
      canvas.height = h * pixDensity

      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
    }
    if (_this.sPX !== previousSpx) {
      const event = new CustomEvent('changePxSize', { detail: _this.sPX })
      window.dispatchEvent(event)
    }
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

/**
 * @param {ScalableCanvasFromImageOptions=} options
 * @constructor
 */
function ScalableCanvasFromImageOptions (options) {
  if (!options) options = {}

  /** @type number */
  this.width = options.hasOwnProperty('width') ? options.width : 1

  /** @type number */
  this.top = options.hasOwnProperty('top') ? options.top : 0

  /** @type number */
  this.left = options.hasOwnProperty('left') ? options.left : 0

  /** @type boolean */
  this.fillParent = options.hasOwnProperty('fillParent') ? options.fillParent : true

  /** @type Gradient */
  this.gradient = options.hasOwnProperty('gradient') ? options.gradient : null

  /** @type boolean */
  this.randomColor = options.hasOwnProperty('randomColor') ? options.randomColor : false

  /** @type boolean */
  this.animate = options.hasOwnProperty('animate') ? options.animate : false

  /** @type boolean */
  this.stroke = options.hasOwnProperty('stroke') ? options.stroke : false

  /** @type boolean */
  this.withBackground = options.hasOwnProperty('withBackground') ? options.withBackground : false

  /** @type Color */
  this.strokeColor = options.hasOwnProperty('strokeColor') ? options.strokeColor : new Color(0)

  /** @type Color */
  this.mainColor = options.hasOwnProperty('mainColor') ? options.mainColor : new Color(0)

  /** @type number */
  this.alphaFactor = options.hasOwnProperty('alphaFactor') ? options.alphaFactor : 1
}

export default ScalableCanvasFromImage
