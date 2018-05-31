<template>
  <div>
    <div class="row output-bar-holder" :class="value.code">
      <label>
        <span>{{value.title}}</span>
      </label>
      <div class="output-bar" :class="value.code">
        <template v-if="value.code === 'video'">
          <popper v-for="(output, i) in outputs"
                  trigger="click" :options="{placement: 'bottom-start'}" :key="i" ref="popups">
            <div class="popper">
              <video-options :output="output" :title="'Screen ' + outputName(output, i)" :index="i" :bus="bus"/>
              <div class="button frameless cancel narrow" @click="onPopperCancel(i)">
                <span class="icon cancel small"></span>
              </div>
            </div>

            <div class="output-box" :class="[value.code, outputClassName(output)]" ref="boxes" slot="reference">
              <div class="description">
                <span class="name">{{outputName(output, i)}}</span>
                <span class="type">{{value.code}}</span>
                <span class="description">{{outputDescription(output)}}</span>
              </div>
              <div class="icon drop-down small"></div>
            </div>
          </popper>
        </template>

        <template v-if="value.code === 'audio'">
          <div v-for="(output, i) in outputs"
               class="output-box" :class="[value.code, outputClassName(output)]" ref="boxes" @click="openOptions(i)">
            <div class="description">
              <span class="name">{{outputName(output, i)}}</span>
              <span class="type">{{outputType(value.code)}}</span>
              <span class="description">{{outputDescription(output)}}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="showDrawer" class="drawer" ref="drawer"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Popper from 'vue-popperjs'
  import VideoOptions from './OutputVideoOptions'

  export default {
    name: 'output-representation-bar',
    components: {
      Popper, VideoOptions
    },
    props: ['value', 'trigger'],

    computed: {},
    data () {
      return {
        outputs: this.value.data || [],
        /** @type ClientRect[] */
        boxes: [],
        showPopperParentVar: true,
        showDrawer: false,
        bus: new Vue()
      }
    },
    mounted () {
      this.bus.$on('updateOutputOptions', (options, index) => {
        // this.outputs[index] = options
        this.onPopperCancel(index)
        this.update()
      })
      this.update()
    },
    methods: {
      openOptions (refIndex) {
        const reference = this.$refs.boxes[refIndex]
        const popper = document.querySelector('.popper.template')
        const anotherPopper = new Popper(reference, popper, {
          modifiers: {
            preventOverflow: {boundariesElement: 'viewport'}
          }
        })
        return anotherPopper
      },

      onPopperCancel (popupIndex) {
        this.$refs.popups[popupIndex].doClose()
      },
      onPopperSubmit (popupIndex) {
      },

      updateOutputOptions (options, outputIndex) {
        // this.outputs[outputIndex] = options
        this.onPopperCancel(outputIndex)
        this.update()
      },

      update () {
        this.$nextTick(() => {
          this.$emit('update', this.value.code, this.outputs)
        })
      },
      collectBoxes () {
        const bounds = []
        if (this.$refs.boxes) {
          this.$refs.boxes.forEach((el, i) => {
            const output = this.outputs[i]
            bounds.push({type: output.type, objectBounds: el.getBoundingClientRect()})
          })
        }
        return bounds
      },
      outputName (output, n) {
        n++
        switch (this.value.code) {
          case 'video':
            return n
          case 'audio':
            const names = ['Mono', 'L', 'R']
            let name = n
            if (this.value.data.length === 2) {
              name = names[n]
            } else if (this.value.data.length === 1) {
              name = names[0]
            }
            return name
        }
      },
      /**
       * @param {string} type
       * @return {string}
       */
      outputType (type) {
        return type
      },
      /**
       * @param {OutputGeneric} output
       * @return {string}
       */
      outputDescription (output) {
        if (this.value.code === 'video') {
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
    },
    watch: {
      value (newValue) {
        this.outputs = newValue.data || []
      },
      // value () {
      //   if (this.value.data.length < this.outputs.length) {
      //     this.outputs = this.outputs.slice(0, this.value.data.length)
      //   } else if (this.value.data.length > this.outputs.length) {
      //     const numToAdd = this.value.data.length - this.outputs.length
      //     for (let i = 0; i < numToAdd; i++) {
      //       const output = this.value.type === 'audio' ? new AudioOutput() : new VideoOutput()
      //       this.outputs.push(output)
      //     }
      //   }
      //   this.update()
      // },
      trigger () {
        this.$nextTick(() => {
          this.update()
        })
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
    margin-top: $module-size;
    /*display: flex;*/
    /*flex-flow: column nowrap;*/
  }

  .drawer {
    height: 5 * $module-size;
    background: greenyellow;
    width: 100%;
  }

  .output-bar {
    position: relative;
    display: flex;
    align-items: flex-end;

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
        background: $bg-secondary-color
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
