<template>
  <div class="channel" ref="channel">
    <connectors-canvas
      :start-connectors="outputSockets"
      :end-connectors="outputBoxes"
      :colors="colors"
      :trigger="trigger">
    </connectors-canvas>
    <div class="module component source">
      <div class="body source">
        <label for="sourceUrl">
          <span>Source</span>
        </label>
        <div class="info">
          <input
            class="path"
            id="sourceUrl"
            name="sourceUrl"
            v-model="source"
            v-on:paste="updateSource" @change="updateSource"/>
          <span class="description">{{sourceDescription}}</span>
        </div>
        <div class="button frameless">
          <div class="icon drop-down small"></div>
        </div>
      </div>
      <div class="panel outputs">
        <output-control-panel
          v-for="output in outputTypes"
          ref="outputControls"
          :num-outputs="numberOutputs[output.type]"
          :output-title="output.title"
          :type="output.type"
          v-on:update="updateOutputsNumber(...arguments)"/>
      </div>
    </div>
    <div class="outputs-presentation">
      <output-representation-bar
        v-for="output in outputTypes"
        ref="outputBars"
        :type="output.type"
        :outputs-number="numberOutputs[output.type]"
        :output-list="outputs[output.type]"
        v-on:update="updateOutputs(...arguments)"
        :trigger="barTrigger"/>
    </div>
  </div>
</template>

<script>
  /** @typedef {
   *  {
   *    url: string,
   *    width: number,
   *    height: number,
   *    duration: number,
   *    author_name: string,
   *    author_url: string,
   *    description: string,
   *    vimeo_id: number,
   *    thumbnail: { url: string, width: number, height: number },
   *    error: string,
   *    warning: string
   *  }
   * } VimeoVideoInfo
   */
  import axios from 'axios'

  import OutputControlPanel from './OutputControlPanel'
  import OutputRepresentationBar from './OutputRepresentationBar'
  import ConnectorsCanvas from './ConnectorsCanvas'
  import VueSelect from '../Select/components/Select'

  import vimeoLink from '../../../helpers/vimeoLink'

  export default {
    name: 'source-channel',
    components: {
      OutputControlPanel,
      OutputRepresentationBar,
      ConnectorsCanvas,
      VueSelect
    },
    mixins: [vimeoLink],
    data () {
      return {
        source: '',
        sourceDescription: '',
        outputs: {
          audio: [{ type: 'loudspeaker' }, { type: 'loudspeaker' }],
          video: [{ type: 'any screen', resolution: [0, 0], orientation: 'landscape' }]
        },
        numberOutputs: { audio: 2, video: 1 },
        /** @type GroupedConnectors[] */
        outputSockets: [],
        /** @type GroupedConnectors[] */
        outputBoxes: [],
        outputTypes: [
          { type: 'audio', title: 'Audio' },
          { type: 'video', title: 'Video' }
        ],
        colors: {
          video: 'rgba(115, 253, 234, 0.6)',
          audio: 'rgba(248, 186, 0, 0.6)'
        },
        trigger: 0,
        barTrigger: 0
      }
    },
    mounted () {
    },
    methods: {
      updateSource () {
        this.sourceDescription = ''
        const url = this.source
        if (this.getVimeoVideoIdFromUrl(url)) {
          this.getVimeoVideoInfo(url, (/** @type VimeoVideoInfo */ vimeoInfo) => {
            this.sourceDescription = `Vimeo video ${vimeoInfo.width} x ${vimeoInfo.height} px | [${vimeoInfo.duration}]`
          })
        } else {
          const requestUrl = 'http://pxflux.com/url-to-headers/?url=' + encodeURIComponent(url)
          const config = { headers: {'Access-Control-Allow-Origin': '*'} }
          axios.get(requestUrl, config).then(function (response) {
            console.log(response)
            const type = response.data['Content-Type']
            this.sourceDescription = `type: ${type}`
          }.bind(this))
        }
      },
      updateOutputs (type, outputs) {
        this.outputs[type] = outputs
        this.refreshOutputConnections()
      },
      refreshOutputConnections () {
        this.$nextTick(() => { // let sockets to be updated.. if they need it
          this.$refs.outputBars.forEach(bar => {
            this.outputBoxes[bar.type] = bar.collectBoxes()
          })
          this.$refs.outputControls.forEach(bar => {
            this.outputSockets[bar.type] = bar.collectSocketBounds()
          })
          this.trigger++ // TODO find a better way to trigger the update in the canvas
        })
      },
      updateOutputsNumber (sockets, type) {
        this.outputSockets[type] = sockets
        this.numberOutputs[type] = sockets.length
        this.barTrigger++ // TODO find a better way to trigger the update in the bar
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
  
  .channel {
    position: relative;
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  
  .module {
    width: $module-size * 8;
    .body {
      display: flex;
      align-items: center;
      position: relative;
      height: $module-size * 1.5;
      background: $bg-secondary-color;
      @include hairline-border($positionRelative: true, $side: all, $color: #808080, $bg-color: $dark-bg);
      
      label {
        display: block;
        height: 100%;
        width: $module-size * 1.5;
        background: $bg-color;
        flex-shrink: 0;
        position: relative;
        > span {
          @include centered();
        }
      }
      
      .info {
        flex-grow: 1;
        line-height: 1.5;
        text-align: center;
        background: transparent;
        cursor: pointer;
        
        span, input {
          display: block;
          height: $module-size/2;
          line-height: $module-size/2;
          white-space: nowrap;
          
          &.path {
            font-size: 110%;
            color: $button-text-color;
            width: 100%;
            box-shadow: none;
            &:focus {
              outline: none;
            }
          }
          &.description {
            font-size: $font-size-caption;
          }
        }
      }
      .button {
        padding: 0;
        flex-shrink: 0;
        height: 100%;
      }
      
    }
    .panel {
      display: flex;
      flex-flow: row nowrap;
      position: relative;
      min-height: $module-size;
      color: $font-color-on-dark;
    }
    
    button.modal {
      width: 100%;
      height: 100%;
      box-shadow: none;
      font-size: $font-size-h1 * 0.75;
      line-height: initial;
      color: $button-text-color;
      span.help {
        min-height: auto;
        display: block;
        color: #888888;
        font-size: $font-size-caption; // /1.2;
        line-height: initial;
      }
    }
  }
  
  .outputs-presentation {
    position: relative;
    min-height: $module-size * 2;
  }
</style>