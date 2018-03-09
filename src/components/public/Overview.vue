<template>
  <main ref="main" class="home">
    <div class="logo-wrap">
      <canvas id="px-main-logo"></canvas>
    </div>
    <div class="subtitle" ref="subtitleBox">
      <div v-for="w in pxSubtitlesWords" class="word">
        <span v-for="l in w" ref="subtitleLetters">{{l}}</span>
      </div>
    </div>
  </main>
</template>
<script>
  import Color from '../../assets/js/color'
  import Logo from '../../assets/js/logo'

  export default {
    data () {
      return {
        slogan: 'Flux of picture elements', // 'Art in flux of pixels',
        logo: null,
        pixelRatio: window.devicePixelRatio || 1
      }
    },
    computed: {
      pxSubtitleLetters () {
        return this.slogan
      },
      pxSubtitlesWords () {
        const txt = this.pxSubtitleLetters.toUpperCase()
        const words = txt.split(' ')
        const pxWords = []
        words.forEach((w, i) => {
          const ll = w.split('')
          ll.push(' ')
          pxWords.push(ll)
        })
        return pxWords
      }
    },

    methods: {
      sPxToBgSize (sPx) {
        if (sPx % 3 === 0) return 3
        if (sPx % 2 === 0) return 2
        return null
      }
    },

    mounted: function () {
      window.addEventListener('resize', () => {
        this.logo.setup(getLogoURL())
      })
      this.$nextTick(() => {
        window.addEventListener('changePxSize', e => {
          const sPx = e.detail
          const cssPx = Math.round(sPx / this.pixelRatio)
          let bgSize = this.sPxToBgSize(cssPx)
          if (!bgSize) bgSize = sPx / 4
          const bgFile = `grid-cell-${bgSize}px-o10@${this.pixelRatio}x.png`
          document.body.style.backgroundImage = `url('/static/img/${bgFile}')`
          document.body.style.backgroundSize = bgSize + 'px'

          const subtitle = this.$refs['subtitleBox']
          if (subtitle) subtitle.style.left = 0

          const letters = this.$refs['subtitleLetters']
          if (Array.isArray(letters)) {
            letters.forEach(e => {
              e.style.width = cssPx + 'px'
              e.style.height = cssPx + 'px'
              e.style.lineHeight = cssPx + 'px'
              e.style.marginTop = cssPx + 'px'
              e.style.fontSize = cssPx + 'px'
            })
          }
          this.$nextTick(() => {
            if (subtitle) {
              subtitle.style.left = cssPx * (this.logo.logoLeftSpx + 1) + 'px'
              subtitle.style.top = cssPx * (this.logo.logoTopSpx + this.logo.logoH) + 'px'
            }
          })
        })
      })

      this.$nextTick(() => {
        let logoURL = getLogoURL()
        const canvasID = 'px-main-logo'
        const options = {
          stroke: true,
          top: 4,
          left: 0,
          mainColor: new Color(203, 16, 26),
          strokeColor: new Color(0).setAlpha(0.1)
        }
        this.logo = new Logo(logoURL, canvasID, options)
        this.logo.setup()
      })

      function getLogoURL () {
        const el = document.getElementById('px-logo-box')
        const style = window.getComputedStyle(el)
        return style.backgroundImage.slice(4, -1).replace(/"/g, '')
      }
    },

    destroyed () {
      document.body.style.removeProperty('background-image')
      document.body.style.removeProperty('background-size')
    }
  }
</script>
<style lang="scss">
  @import "../../assets/sass/vars";
  @import "../../assets/sass/mixins";
  
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
    
    .subtitle {
      position: absolute;
      display: flex;
      flex-flow: row wrap;
      top: $module-size;
      color: #434343;
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
        background: transparentize($bg-color, 0.7);
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
    position: relative;
    display: block;
  }


</style>
