<template>
  <div v-if="videoId" class="video-box" ref="videoBox">
    <div ref="vimeoContainer" class="vimeo-player"></div>
    <div class="overlay" @click="togglePlay">
      <div class="button frameless" :class="{ play: paused, pause: !paused }" @click="togglePlay">
        <i :class="{ play: paused, pause: !paused }"></i>
      </div>
    </div>
  </div>
  <div v-else>Video ID is not valid.</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Player from '@vimeo/player'

const props = defineProps({
  videoUrl: {
    type: [String, Number],
    required: true
  },
  ratio: {
    type: Number,
    default: 16 / 9
  },
  fillParent: {
    type: Boolean,
    default: false
  }
})

const fillVideoBox = ref(props.fillParent)
const paused = ref(true)
const videoBox = ref(null)
const vimeoContainer = ref(null)
let player = null

const videoId = computed(() => {
  if (Number.isInteger(props.videoUrl)) {
    return props.videoUrl
  }
  const match = props.videoUrl.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/)
  return match ? match[1] : null
})

const fitToParent = () => {
  if (!fillVideoBox.value) {
    return
  }

  const iframe = videoBox.value?.querySelector('iframe')
  if (!iframe) {
    return
  }
  const parentRect = videoBox.value.getBoundingClientRect()
  const parentRatio = parentRect.width / parentRect.height

  let w
  let h
  if (props.ratio < parentRatio) {
    w = parentRect.width
    h = w / props.ratio
  } else {
    h = parentRect.height
    w = h * props.ratio
  }
  iframe.style.width = Math.ceil(w) + 'px'
  iframe.style.height = Math.ceil(h) + 'px'
}

const setPaused = (value) => {
  paused.value = value
}

const onLoad = () => {
  if (!player) {
    return
  }
  player.setVolume(1)
  fitToParent()
}

const togglePlay = () => {
  if (paused.value) {
    play()
  } else {
    stop()
  }
}

const play = () => {
  player?.play()
}

const stop = () => {
  player?.pause()
}

const initPlayer = () => {
  if (!vimeoContainer.value || !videoId.value) {
    return
  }

  player = new Player(vimeoContainer.value, {
    id: videoId.value,
    background: true,
    autoplay: false,
    byline: false,
    portrait: false,
    title: false,
    fullscreen: false
  })

  player.on('play', () => setPaused(false))
  player.on('pause', () => setPaused(true))
  player.on('loaded', onLoad)
}

onMounted(() => {
  initPlayer()
  window.addEventListener('resize', fitToParent)
})

onUnmounted(() => {
  window.removeEventListener('resize', fitToParent)
  if (player) {
    player.destroy()
  }
})
</script>
