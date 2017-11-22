<template>
  <div class="vide-box">
    <!--<vimeo-player v-if="videoID" ref="player" :background="'1'" :height="100"-->
                  <!--:data-vimeo-url="'http://player.vimeo.com/video/'+ videoID +'?title=1&byline=0&portrait=0&play-bar=0&background=1'"-->
                  <!--@ready="onReady">-->
    <!--</vimeo-player>-->
    <iframe :src="'http://player.vimeo.com/video/'+ videoID +'?title=0&byline=0&portrait=0&play-bar=0&background=1'" width="300" height="169" frameborder="0"></iframe>
    <button @click="play">Play</button>
  </div>
</template>

<script>
  import { vueVimeoPlayer } from 'vue-vimeo-player'

  export default {
    props: ['videoID'],
    components: {
      'vimeo-player': vueVimeoPlayer
    },
    data () {
      return {
        // videoID: 'some-id',
        height: 100,
        options: {
          background: true,
          autopause: false
        },
        playerReady: false
      }
    },
    methods: {
      onReady () {
        this.playerReady = true
      },
      play () {
        this.$refs.player.play()
      },
      stop () {
        this.$refs.player.stop()
      }
    }
  }
</script>