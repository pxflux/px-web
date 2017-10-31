/* eslint-disable no-trailing-spaces */

import SuperGif from './libgif'

export default (function (options) {
  const sup = new SuperGif(options)
  this.sup = sup
  this.play = () => { sup.play() }
  this.pause = () => { sup.pause() }

  let registerCanvasHandlers = function () {
    const isvp = function (x) {
      return (options.vp_l ? (x - options.vp_l) : x)
    }

    const canvas = sup.get_canvas()
    // allow movement if < 1000 ms (1 sec)
    let w, maxDistance, startX, startTime
    w = (options.vp_w ? options.vp_w : canvas.width)
    maxDistance = Math.floor(w / (sup.get_length() * 2))
    startX = 0
    startTime = 0

    const canTouch = 'ontouchend' in document

    let aj = 0

    canvas.addEventListener((canTouch) ? 'touchstart' : 'mousedown', function (e) {
      // prevent image drag (Firefox)
      e.preventDefault()
      if (sup.get_auto_play()) {
        sup.pause()
      }

      const pos = (e.touches && e.touches.length > 0) ? e.touches[ 0 ] : e

      const x = (pos.layerX > 0) ? isvp(pos.layerX) : w / 2
      const progress = x / w

      sup.move_to(Math.floor(progress * (sup.get_length() - 1)))

      startTime = e.timeStamp
      startX = isvp(pos.pageX)
    })

    canvas.addEventListener((canTouch) ? 'touchend' : 'mouseup', function () {
      startTime = 0
      startX = 0
      if (sup.get_auto_play()) {
        sup.play()
      }
    })

    canvas.addEventListener((canTouch) ? 'touchmove' : 'mousemove', function (e) {
      e.preventDefault()
      const pos = (e.touches && e.touches.length > 0) ? e.touches[ 0 ] : e

      const currentX = isvp(pos.pageX)
      const currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX)
      // allow if movement < 1 sec
      if (startTime !== 0 && currentDistance > maxDistance) {
        if (currentX < startX && sup.get_current_frame() > 0) {
          sup.move_relative(-1)
        }
        if (currentX > startX && sup.get_current_frame() < sup.get_length() - 1) {
          sup.move_relative(1)
        }
        startTime = e.timeStamp
        startX = isvp(pos.pageX)
      }

      aj++
      if (document.getElementById('tickles' + ((aj % 5) + 1))) {
        document.getElementById('tickles' + ((aj % 5) + 1)).play()
      }
    })
  }

  sup.orig_load = sup.load
  sup.load = function (callback) {
    sup.orig_load(function () {
      if (callback) {
        callback()
      }
      registerCanvasHandlers(sup)
    })
  }
})()
