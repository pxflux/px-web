<template>
  <div class="panel" v-model="numOutputs" :class="type" ref="panel">
    <div class="button frameless">
      <div class="icon minus" @click="changeNumberOutputs(-1)"></div>
    </div>
    <div class="button frameless">
      <div class="icon plus" @click="changeNumberOutputs(1)"></div>
    </div>
    <div class="connectors">
      <header>{{ outputTitle }}</header>
      <div class="sockets">
        <span v-for="i in numSockets"
              class="socket" :class="type" ref="sockets"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'output-control-panel',
    props: ['numOutputs', 'outputTitle', 'type'],
    data () {
      return {
        numSockets: this.numOutputs
      }
    },
    computed: {
      className () {
        return this.outputTitle.toLowerCase()
      }
    },
    mounted () {
      this.changeNumberOutputs(0)
    },
    methods: {
      changeNumberOutputs (n) {
        this.numSockets += n
        if (this.numSockets < 0) this.numSockets = 0
        if (this.numSockets > 18) this.numSockets = 18
        this.$nextTick(() => { // just to let sockets to be updated first
          const bounds = this.collectSocketBounds()
          this.$emit('update', bounds, this.type)
        })
      },
      collectSocketBounds () {
        const panelBounds = this.$refs.panel.getBoundingClientRect()
        const bounds = []
        this.$refs.sockets.forEach(socketEl => {
          bounds.push({
            type: 'socket',
            objectBounds: this.modifyBoundingRect(socketEl, panelBounds)
          })
        })
        return bounds
      },
      modifyBoundingRect (socketEl, panelBounds) {
        const socketBounds = socketEl.getBoundingClientRect()
        return {
          left: socketBounds.left,
          top: socketBounds.top,
          right: socketBounds.right,
          bottom: panelBounds.bottom,
          x: socketBounds.x,
          y: socketBounds.y,
          width: socketBounds.width,
          height: panelBounds.bottom - socketBounds.top
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/sass/vars";
  @import "../../../assets/sass/mixins";
  @import "../../../assets/sass/hidpi";
  @import "../../../assets/sass/components/hairline";
  
  .panel {
    width: 50%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    position: relative;
    background: $dark-bg;
    @include hairline-border($positionRelative: true, $side: all, $color: #808080, $bg-color: $dark-bg);
    
    &.video {
      flex-flow: row-reverse nowrap;
    }
    .button {
      background: transparent;
      .icon:before,
      .icon:after {
        border-color: darken($font-color-on-dark, 30%);
      }
    }
    header {
      min-height: auto;
      height: auto;
      font-size: $font-size-caption;
      text-align: center;
      margin-bottom: 2px;
    }
    .connectors {
      flex-grow: 1;
      
      .sockets {
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        align-items: center;
        
        .socket {
          display: block;
          width: 6px;
          height: 6px;
          margin: 2px;
          border-radius: 50%;
          background: #ccc;
          &.audio {
            background: $audio-color;
          }
          &.video {
            background: $video-color;
          }
          
        }
      }
    }
  }
</style>