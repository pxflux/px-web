<template>
  <div class="output-bar-holder" :class="type">
    <div class="output-bar" :class="type">
      <popper
        v-for="(output, i) in outputs"
        trigger="click"
        :options="{
            placement: 'top-start',
            modifiers: {
              /*flip: {behavior: ['top']}*/
            }
        }">
        <div v-if="type==='video'" class="popper">
          <div>Popper Content Popper Content Popper Content Popper Content Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
          <div>Popper Content</div>
        </div>
        <div
          class="output-box" :class="[type, outputClassName(output)]"
          ref="boxes"
          slot="reference">
          <div class="description">
            <span class="name">{{outputName(output, i)}}</span>
            <span class="type">{{outputType(output)}}</span>
            <span class="description">{{outputDescription(output)}}</span>
          </div>
          <div v-if="type==='video'" class="icon drop-down small"></div>
        </div>
      </popper>
      <!--</popper>-->
    </div>
  
  </div>
</template>

<script>
  import Popper from 'vue-popperjs'
  import 'vue-popperjs/dist/css/vue-popper.css'

  /**
   * @typedef {{
   *  type: 'projection'
   *  resolution: [0, 0]
   *  orientation: 'landscape'
   * }} OutputGeneric
   /**
   * @prop {string} type
   */
  class AudioOutput {
    constructor () {
      this.type = 'loudspeaker'
    }
  }

  /**
   * @prop {string} type
   */
  class VideoOutput {
    constructor () {
      this.type = 'projection'
      this.resolution = [0, 0]
      this.orientation = 'landscape'
    }
  }

  export default {
    name: 'output-representation-bar',
    components: {
      Popper
    },
    props: [
      'type',
      'outputList',
      'outputsNumber',
      'trigger'
    ],
    data () {
      return {
        numberAudioOutputs: 0,
        numberVideoOutputs: 0,
        /** @type [] */
        outputs: this.outputList,
        /** @type ClientRect[] */
        boxes: [],
        showPopperParentVar: true
      }
    },
    mounted () {
      this.update()
    },
    watch: {
      outputsNumber () {
        if (this.outputsNumber < this.outputs.length) {
          this.outputs = this.outputs.slice(0, this.outputsNumber)
        } else if (this.outputsNumber > this.outputs.length) {
          const numToAdd = this.outputsNumber - this.outputs.length
          for (let i = 0; i < numToAdd; i++) {
            const output = this.type === 'audio' ? new AudioOutput() : new VideoOutput()
            this.outputs.push(output)
          }
        }
        this.update()
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
          // this.boxes = this.collectBoxes()
          this.$emit('update', this.type, this.outputs)
        })
      },
      collectBoxes () {
        const bounds = []
        this.$refs.boxes.forEach((boxEl, i) => {
          const output = this.outputs[i]
          bounds.push({ type: output.type, objectBounds: boxEl.getBoundingClientRect() })
        })
        return bounds
      },
      outputName (output, n) {
        n++
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
      /**
       * @param {OutputGeneric} output
       * @return {string}
       */
      outputType (output) {
        return output.type
      },
      /**
       * @param {OutputGeneric} output
       * @return {string}
       */
      outputDescription (output) {
        if (this.type === 'video') {
          return 'Any resolution'
        }
      },
      /**
       * @param {OutputGeneric} output
       * @return {string}
       */
      outputClassName (output) {
        return output.type.toLowerCase().replace(' ', '-')
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
          &:last-child, &.type {
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
        margin-top: $module-size/4;
      }
    }
  }
</style>