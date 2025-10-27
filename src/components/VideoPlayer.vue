<template>
  <div v-if="videoId" class="video-box" ref="videoBox">
    <vimeo-player ref="player" class="vimeo-player"
                  :video-id='videoId'
                  :options="{background:true, autoplay:false, byline:false, portrait:false, title:false, fullscreen:false}"
                  @pause="setPaused(true)"
                  @play="setPaused(false)"
                  @loaded="onLoad"/>
    <div class="overlay" @click="togglePlay">
      <div class="button frameless" :class="{play: paused, pause: !paused}" @click="togglePlay">
        <i :class="{play: paused, pause: !paused}"></i>
      </div>
    </div>
  </div>
  <div v-else>Video ID is not valid.</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { vueVimeoPlayer } from 'vue-vimeo-player'

const props = defineProps({
  videoUrl: {
    type: [String, Number],
    required: true
  },
  ratio: {
    type: Number,
    default: 16/9
  },
  fillParent: {
    type: Boolean,
    default: false
  }
})

const fillVideoBox = ref(props.fillParent)
const paused = ref(true)
const videoBoxEl = ref(null)
const player = ref(null)
const videoBox = ref(null)

const videoId = computed(() => {
  if (Number.isInteger(props.videoUrl)) {
    return props.videoUrl
  }
  const match = props.videoUrl.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/)
  return match ? match[1] : null
})

const playerId = computed(() => 'vp' + videoId.value)

const fitToParent = () => {
  if (!fillVideoBox.value) return

  const iframe = videoBoxEl.value?.querySelector('iframe')
  if (!iframe) return
  const parentRect = videoBoxEl.value.getBoundingClientRect()
  const parentRatio = parentRect.width / parentRect.height

  let w, h
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
  if (!player.value) return
  player.value.unmute()
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
  player.value?.play()
}

const stop = () => {
  player.value?.pause()
}

onMounted(() => {
  videoBoxEl.value = videoBox.value
  window.addEventListener('resize', fitToParent)
})
</script>
