<template>
  <div class="output-bar-holder" :class="type">
    <div class="output-bar" :class="type">
      <div v-for="i in outputsNumber" class="output-box" :class="type" ref="boxes">
        <div class="description">
          <span>{{channelName(i)}}</span><span>{{channelType(i)}}</span>
        </div>
        <div class="icon drop-down small"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import ConnectorsCanvas from './ConnectorsCanvas'

  export default {
    name: 'output-representation-bar',
    components: {
      ConnectorsCanvas
    },
    props: [
      'type',
      'outputList',
      'outputsNumber',
      'color',
      'trigger'
    ],
    data () {
      return {
        numberAudioOutputs: 0,
        numberVideoOutputs: 0,
        /** @type Equipment[] */
        outputs: [],
        /** @type ClientRect[] */
        sockets: [],
        /** @type ClientRect[] */
        boxes: []
      }
    },
    mounted () {
      this.update()
    },
    watch: {
      outputsNumber () {
        this.$nextTick(() => {
          this.update()
        })
      },
      trigger () {
        this.$nextTick(() => {
          this.update()
        })
      }
    },
    methods: {
      update () {
        this.$nextTick(() => {
          this.boxes = this.collectConnectorsData()
          this.$emit('update', this.boxes)
        })
      },
      collectConnectorsData () {
        const bounds = []
        this.$refs.boxes.forEach(boxEl => {
          bounds.push({ type: 'box', objectBounds: boxEl.getBoundingClientRect() })
        })
        return bounds
      },
      channelName (n) {
        switch (this.type) {
          case 'video':
            return n
          case 'audio':
            const names = ['Mono', 'L', 'R']
            let name = n
            if (this.outputsNumber === 2) {
              name = names[n]
            } else if (this.outputsNumber === 1) {
              name = names[0]
            }
            return name
        }
      },
      channelType (n) {
        // TODO here must be a proper type description selection
        switch (this.type) {
          case 'video':
            return 'Screen'
          case 'audio':
            return 'Loudspeaker'
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
  @import "../../../assets/sass/components/buttons";
  
  $audio-bar-height: $module-size * 2;
  $video-box-height: $module-size * 2;
  
  .output-bar-holder {
    position: relative;
    /*display: flex;*/
    /*flex-flow: column nowrap;*/
  }
  
  .output-bar {
    position: relative;
    display: flex;
    align-items: flex-end;
    margin-top: $module-size;
    
    min-height: $module-size;
    
    .output-box {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      align-items: center;
      margin-right: $module-size / 8;
      
      width: $module-size * 2;
      height: $module-size;
      padding: 0;
      
      @include hairline-border($positionRelative: true, $side: all, $color: #808080, $bg-color: $dark-bg);
      
      &.audio {
        background: darken($bg-secondary-color, 15%);
      }
      .icon {
        position: absolute;
        top: 0;
        right: 0;
        width: $module-size/2;
        height: $module-size/2;
        @include button-icon(drop-down);
        &:before {
          border-color: #c7c7c7;
        }
      }
      .description {
        text-align: center;
        flex-grow: 1;
        span {
          display: block;
          &:last-child {
            font-size: $font-size-caption / 1.2;
          }
        }
      }
    }
    .output-box.video {
      $screen-width: $module-size * 2 * (16/9);
      
      background: #fff;
      height: $module-size * 2;
      width: $screen-width;
      position: relative;
      
      &.projection {
        margin-top: $module-size/2;
        &:after {
          content: '';
          display: block;
          box-sizing: border-box;
          position: absolute;
          width: 100%;
          height: $module-size/2;
          bottom: 100%;
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
</style>