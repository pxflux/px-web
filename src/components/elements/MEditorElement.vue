<template>
  <div class="progress" :style="{
    'width': percent+'%',
    'height': height,
    'background-color': canSuccess? color : failedColor,
    'opacity': show ? 1 : 0
  }"></div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const percent = ref(0)
const show = ref(false)
const canSuccess = ref(true)
const duration = ref(3000)
const height = ref('2px')
const color = ref('#ffca2b')
const failedColor = ref('#ff0000')
let timer = null

const start = () => {
  show.value = true
  canSuccess.value = true
  if (timer) {
    clearInterval(timer)
    percent.value = 0
  }
  const cut = 10000 / Math.floor(duration.value)
  timer = setInterval(() => {
    increase(cut * Math.random())
    if (percent.value > 95) {
      finish()
    }
  }, 100)
  return { start, set, get: () => Math.floor(percent.value), increase, decrease, finish, pause, hide, fail }
}

const set = (num) => {
  show.value = true
  canSuccess.value = true
  percent.value = Math.floor(num)
  return { start, set, get: () => Math.floor(percent.value), increase, decrease, finish, pause, hide, fail }
}

const increase = (num) => {
  percent.value = percent.value + Math.floor(num)
  return { start, set, get: () => Math.floor(percent.value), increase, decrease, finish, pause, hide, fail }
}

const decrease = (num) => {
  percent.value = percent.value - Math.floor(num)
  return { start, set, get: () => Math.floor(percent.value), increase, decrease, finish, pause, hide, fail }
}

const finish = () => {
  percent.value = 100
  hide()
  return { start, set, get: () => Math.floor(percent.value), increase, decrease, finish, pause, hide, fail }
}

const pause = () => {
  clearInterval(timer)
  return { start, set, get: () => Math.floor(percent.value), increase, decrease, finish, pause, hide, fail }
}

const hide = () => {
  clearInterval(timer)
  timer = null
  setTimeout(() => {
    show.value = false
    nextTick(() => {
      setTimeout(() => {
        percent.value = 0
      }, 200)
    })
  }, 500)
  return { start, set, get: () => Math.floor(percent.value), increase, decrease, finish, pause, hide, fail }
}

const fail = () => {
  canSuccess.value = false
  return { start, set, get: () => Math.floor(percent.value), increase, decrease, finish, pause, hide, fail }
}
</script>

<style scoped>
  .progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    width: 0;
    transition: width 0.2s, opacity 0.4s;
    opacity: 1;
    background-color: #efc14e;
    z-index: 999999;
  }
</style>
