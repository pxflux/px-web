<template>
  <main ref="main" class="home">
    <div class="logo-wrap">
      <canvas id="px-main-logo"></canvas>
    </div>
    <div class="wrap-content" ref="wrap">
      <h1 style="padding: 0 4rem;">
        AN OPEN-SOURCE ECOSYSTEM FOR DIGITALLY BORN TIME-BASED ART
      </h1>
      <div class="content columns">
        <div class="column">
          <h1>TIME-BASED & DIGITAL ART NOTATION SYSTEM</h1>
          Our Time-based & Digital Art Notation System is a specific data structure and editing environment made for generating extensive artwork related metadata. The aim of the notation system is to record work-defining properties, its conceptual dependencies, aesthetics, and behavior. As the result the notation system allows to capture the artistic intentions which could be accurately translated to different equipment and exhibiting contexts.
        </div>
        <div class="column">
          <h1>ARTWORK PLAYER</h1>
          The Artwork Player is a cross-platform application whose main task is the real-time rendering of code-based artworks as well as the playback of pre-recorded content as video or audio files. It’s made to support multi-channel artworks and allows synchronization of multiple audio/visual sources. Among the traditional video formats, the player currently fully support the rendering of Javascript, WebGL, WebVR, and HTML5.
        </div>
        <div class="column">
          <h1>ARTWORK REMOTE CONTROL</h1>
          The Artwork Remote Control is a mobile app that allows for user interaction and control of artwork. It is also a tool for management of own Artwork Players and artwork libraries.
          Artwork Remote Control also enables artists to utilize all the available sensors and controlling methods of a modern mobile device.
        </div>
        <div class="column">
          <h1>CURATING/ COLLECTION MANAGEMENT TOOLS</h1>
        </div>
        <div class="column">
          <h1>ITERATION REPORTS, BACKUPS & ARCHIVING</h1>
        </div>
        <div class="column">
          <h1>ARTWORK DISTRIBUTION & MARKET PLACE</h1>
        </div>
        <div class="column">
          <h1>LICENSING CERTIFICATION</h1>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import Color from '../../assets/js/color'
import Logo from '../../assets/js/logo'

const slogan = ref('Art that lives in flux of pixels.')
const logo = ref(null)
const pixelRatio = ref(window.devicePixelRatio || 1)
const main = ref(null)
const wrap = ref(null)
const subtitleBox = ref(null)
const subtitleLetters = ref(null)

const pxSubtitleLetters = computed(() => {
  return slogan.value
})

const pxSubtitlesWords = computed(() => {
  const txt = pxSubtitleLetters.value.toUpperCase()
  const words = txt.split(' ')
  const pxWords = []
  words.forEach((w, i) => {
    const ll = w.split('')
    ll.push(' ')
    pxWords.push(ll)
  })
  return pxWords
})

const sPxToBgSize = (sPx) => {
  if (sPx % 3 === 0) return 3
  if (sPx % 2 === 0) return 2
  return null
}

const getLogoURL = () => {
  const el = document.getElementById('px-logo-box')
  const style = window.getComputedStyle(el)
  return style.backgroundImage.slice(4, -1).replace(/"/g, '')
}

onMounted(() => {
  window.addEventListener('resize', () => {
    if (logo.value) {
      logo.value.setup(getLogoURL())
    }
  })

  window.addEventListener('changePxSize', e => {
    const sPx = e.detail
    const cssPx = Math.round(sPx / pixelRatio.value)
    let bgSize = sPxToBgSize(cssPx)
    if (!bgSize) bgSize = sPx / 4
    const bgFile = `grid-cell-${bgSize}px-o10@${pixelRatio.value}x.png`
    document.body.style.backgroundImage = `url('/static/img/${bgFile}')`
    document.body.style.backgroundSize = bgSize + 'px'

    if (subtitleBox.value) subtitleBox.value.style.left = 0

    if (Array.isArray(subtitleLetters.value)) {
      subtitleLetters.value.forEach(e => {
        e.style.width = cssPx + 'px'
        e.style.height = cssPx + 'px'
        e.style.lineHeight = cssPx + 'px'
        e.style.marginTop = cssPx + 'px'
        e.style.fontSize = cssPx + 'px'
      })
    }
    nextTick(() => {
      if (subtitleBox.value) {
        subtitleBox.value.style.left = cssPx * (logo.value.logoLeftSpx) + 'px'
        subtitleBox.value.style.top = cssPx * (logo.value.logoTopSpx + logo.value.logoH) + 'px'
      }
      if (wrap.value) {
        wrap.value.style.marginTop = cssPx * (logo.value.logoTopSpx + logo.value.logoH) + cssPx + 'px'
      }
    })
  })

  nextTick(() => {
    let logoURL = getLogoURL()
    const canvasID = 'px-main-logo'
    const options = {
      stroke: true,
      top: 4,
      left: 2,
      mainColor: new Color(203, 16, 26),
      strokeColor: new Color(0).setAlpha(0.1),
      fillParent: true
    }
    logo.value = new Logo(logoURL, canvasID, options)
    logo.value.setup()
  })
})

onUnmounted(() => {
  document.body.style.removeProperty('background-image')
  document.body.style.removeProperty('background-size')
})
</script>
<style lang="scss">
  @use "../../assets/sass/vars" as *;
  @use "../../assets/sass/mixins" as *;

  body, #app {
    min-height: 100vh;
    width: 100vw;
    position: relative;
  }

  #app {
    display: flex;
    flex-flow: column nowrap;

  }

  main.home {
    margin-top: 0;
    width: 100vw;
    position: relative;
    flex-grow: 2;

    .wrap-content {
      /*margin-top: 20rem;*/
    }
    .subtitle {
      position: absolute;
      display: flex;
      flex-flow: row wrap;
      top: $module-size;
      color: $logo-bg-color;
      font-size: $module-size;
      .word {
        display: flex;
        flex-flow: row nowrap;
      }
      span {
        display: block;
        width: $module-size;
        height: $module-size;
        text-align: center;
        line-height: $module-size;
        overflow: hidden;
        //background: $dark-bg;
      }
    }
  }

  footer {

  }

  .logo-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  #px-main-logo {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }


</style>
