<template>
  <div class="about">
    <div class="logo-box">
      <canvas id="px-main-logo"></canvas>
    </div>
    <h2 class="subtitle">
      AN OPEN-SOURCE ECOSYSTEM FOR DIGITALLY BORN TIME-BASED ART
    </h2>
    <div class="content">
      <div class="content-cell with-badge one">
        <h1>TIME-BASED & DIGITAL ART NOTATION SYSTEM</h1>
        <p>
          Our Time-based & Digital Art Notation System is a specific data structure and editing environment made for generating extensive artwork related metadata. The aim of the notation system is to record work-defining properties, its conceptual dependencies, aesthetics, and behavior. As the result the notation system allows to capture the artistic intentions which could be accurately translated to different equipment and exhibiting contexts.
        </p>
      </div>
      <div class="content-cell with-badge two">
        <h1>ARTWORK PLAYER</h1>
        <p>
          The Artwork Player is a cross-platform application whose main task is the real-time rendering of code-based artworks as well as the playback of pre-recorded content as video or audio files. It’s made to support multi-channel artworks and allows synchronization of multiple audio/visual sources. Among the traditional video formats, the player currently fully support the rendering of Javascript, WebGL, WebVR, and HTML5.
        </p>
      </div>
      <div class="content-cell with-badge three">
        <h1>ARTWORK REMOTE CONTROL</h1>
        <p>
          The Artwork Remote Control is a mobile app that allows for user interaction and control of artwork. It is also a tool for management of own Artwork Players and artwork libraries.
        Artwork Remote Control also enables artists to utilize all the available sensors and controlling methods of a modern mobile device.
        </p>
      </div>
      <div class="content-cell with-badge inactive">
        <h1>CURATING/ COLLECTION MANAGEMENT TOOLS</h1>
      </div>
      <div class="content-cell with-badge inactive">
        <h1>ITERATION REPORTS, BACKUPS & ARCHIVING</h1>
      </div>
      <div class="content-cell with-badge inactive">
        <h1>ARTWORK DISTRIBUTION & MARKET PLACE</h1>
      </div>
      <div class="content-cell with-badge inactive">
        <h1>LICENSING CERTIFICATION</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import Logo from '../assets/js/logo-v2'

const winW = ref(0)
const logo = ref(null)
const logoWidth = ref(35)
const baseSize = ref(48)
const pixelRatio = ref(window.devicePixelRatio || 1)

const possiblePxSizes = computed(() => {
  return [48 * 2, 48 * 1.5, 48, 48 / 1.5, 48 / 2, 48 / 3, 48 / 4, 48 / 6, 48 / 8, 48 / 12, 48 / 16]
})

const pxSize = computed(() => {
  const w = winW.value - baseSize.value * 2
  const checkSize = w / logoWidth.value
  let size
  possiblePxSizes.value.reduce((pre, next) => {
    if (pre >= checkSize && checkSize >= next) size = next
    return next
  })
  return size
})

const logoURL = computed(() => {
  const el = document.getElementById('px-logo-box')
  if (!el) return ''
  const style = window.getComputedStyle(el)
  return style.backgroundImage.slice(4, -1).replace(/"/g, '')
})

const setWinWidth = () => {
  winW.value = window.innerWidth
  if (logo.value) {
    logo.value.setPxSize(pxSize.value)
  }
  const bgSize = sPxToBgSize(pxSize.value)
  const bgFile = `grid-cell-${bgSize}px-o10@${pixelRatio.value}x.png`
  document.body.style.backgroundImage = `url('/img/${bgFile}')`
  document.body.style.backgroundSize = bgSize + 'px'
}

const sPxToBgSize = (n) => {
  if (n % 3 === 0) return 3
  if (n % 2 === 0) return 2
  return 2
}

onBeforeMount(() => {
  window.addEventListener('resize', setWinWidth)
  setWinWidth()
})

onMounted(() => {
  logo.value = new Logo(logoURL.value, 'px-main-logo', pxSize.value)
  logo.value.setup()
})
</script>

<style lang="scss">
  @use 'sass:math';
  @use '../assets/sass/vars' as *;
  .about {
    padding-top: $module-size;

    width: 100vw;
    min-height: 100vh;

    .subtitle{
      margin: 0 $module-size math.div($module-size, 2);
      /*font-weight: 400;*/
      background: $bg-semi-transparent-color;
      line-height: math.div($module-size, 2);
      display: inline-block;
    }
    .content{
      margin: 0 $module-size;
      padding: 1px;
      background: #eeeeee;

      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
      grid-gap: 1px;

      .content-cell{
        position: relative;
        background: #fff;
        padding: math.div($module-size, 2);

        &.with-badge:before{
          content: '';
          width: math.div($module-size, 2);
          height: math.div($module-size, 2);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          background: rgba(0, 0, 0, 0.5);
        }
        &.with-badge.one:before{
          background: rgb(255, 200, 0);
        }
        &.with-badge.two:before{
          background: rgb(0, 255, 246);
        }
        &.with-badge.three:before{
          background: rgb(0, 134, 255);
        }
      }
    }
  }


  .logo-box{
    position: relative;
    margin: math.div($module-size, 2) $module-size;
  }
  canvas{
    display: block;
  }
</style>
