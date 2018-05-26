<template>
  <div v-if="isVimeo && videoId"
       class="video-box" ref="videoBox">
    <vimeo-player ref="player" :video-id='videoId' :options="options"
                  @pause="setPaused(true)"
                  @play="setPaused(false)"
                  @ready="onReady"
                  @loaded="onLoad"/>
    <div class="overlay" @click="togglePlay">
      <div class="button overlay frameless" @click="togglePlay">
        <div class="icon" :class="{play: paused, pause: !paused}"></div>
      </div>
    </div>
  </div>
  <div v-else="">Video ID is not valid.</div>
</template>

<script>
  import vueVimeoPlayer from 'vue-vimeo-player'
  import { log } from '../helper'
  //  import axios from 'axios'

  export default {
    props: ['videoUrl', 'ratio'],
    components: {
      'vimeo-player': vueVimeoPlayer
    },
    data () {
      return {
        isVimeo: true,
        options: {
          background: true,
          autoplay: false,
          byline: false,
          portrait: false,
          title: false,
          fullscreen: false
        },
        playerReady: false,
        paused: true,
        videoBoxEl: null
      }
    },
    computed: {
      heightFromWidth () {
        if (this.ratio > 1) {
          // landscape orientation

        }
        return this.ratio ? 100 / this.ratio : 50 // %
      },
      videoId () {
        if (Number.isInteger(this.videoUrl)) return this.videoUrl
        const match = this.videoUrl.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/)
        if (!match) {
          return null
        } else {
          return match[1]
        }
      }
    },

    mounted () {
      this.videoBoxEl = this.$refs['videoBox']
      this.fitToParent()
      window.addEventListener('resize', this.fitToParent)
    },

    methods: {
      fitToParent () {
        const parent = this.videoBoxEl.parentElement
        const parentRect = parent.getBoundingClientRect()
        let pW = parentRect.right - parentRect.left
        let h = parentRect.bottom - parentRect.top
        let w = h * this.ratio
        if (w > pW) {
          w = pW
          h = w / this.ratio
        }
        this.videoBoxEl.style.width = w + 'px'
        this.videoBoxEl.style.height = h + 'px'
      },

      setPaused (s) { this.paused = s },

      onReady () {
        log(this.$refs.player)
      },

      onLoad () {
        this.playerReady = true
        this.$nextTick(function () {
          this.$refs.player.pause()
          this.paused = true
        })
      },
      togglePlay () {
        log('this.paused::::')
        log(this.paused.toString())
        if (this.paused) {
          this.play()
        } else {
          this.stop()
        }
      },
      play (stop) {
        this.$refs.player.play()
      },
      stop () {
        this.$refs.player.pause()
      }
    }
  }
</script>