<template>
  <router-link to="/">
    <div id="px-logo-box" class="px-logo">
      <canvas id="px-logo"></canvas>
      <span class="label beta"></span>
    </div>
  </router-link>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import ScalableCanvasFromImage from '../assets/js/logo'
import ColorFlicker from '../assets/js/color-flicker'
import { log } from '../helper'

const setFlicker = () => {
  nextTick(() => {
    new ColorFlicker().flickElement()
  })
}

const getLogoURL = () => {
  const el = document.getElementById('px-logo-box')
  if (!el) return ''
  const style = window.getComputedStyle(el)
  return style.backgroundImage.slice(4, -1).replace(/"/g, '')
}

onMounted(() => {
  nextTick(() => {
    try {
      let logoURL = getLogoURL()
      const canvasID = 'px-logo'
      const canvas = document.getElementById(canvasID)
      if (canvas && logoURL) {
        const logo = new ScalableCanvasFromImage(logoURL, canvasID, { fillParent: false })
        logo.setup()
        window.addEventListener('resize', () => {
          logo.setup(getLogoURL())
        })
      }
    } catch (error) {
      log('Error setting up logo:', error)
    }
    setFlicker()
  })
})
</script>

