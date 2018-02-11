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
        <label>
          <span>Source</span>
        </label>
        <div class="info">
          <span class="path">…/afterglow/?screens=3</span>
          <span class="description">Video: 5760 x 1080 px | 25 fps | ∞</span>
        </div>
        <div class="button frameless">
          <div class="icon drop-down small"></div>
        </div>
      </div>
      <div class="panel outputs">
        <output-block
          :num-outputs="numberAudioOutputs"
          :output-title="'Audio'"
          v-on:update="updateOutputs('audio', ...arguments)"/>
        <output-block
          :num-outputs="numberVideoOutputs"
          :output-title="'Video'"
          v-on:update="updateOutputs('video', ...arguments)"/>
      </div>
    </div>
    <div class="outputs-presentation">
      <output-representation-bar
        v-if="numberAudioOutputs"
        :type="'audio'"
        :outputs-number="numberAudioOutputs"
        :color="colors.audio"
        v-on:update="updateOutputsBoxes('audio', ...arguments)"
        :trigger="barTrigger"/>
      <output-representation-bar
        v-if="numberVideoOutputs"
        :type="'video'"
        :outputs-number="numberVideoOutputs"
        :color="colors.video"
        v-on:update="updateOutputsBoxes('video', ...arguments)"
        :trigger="barTrigger"/>
    </div>
  </div>
</template>

<script>
  import OutputBlock from './OutputBlock'
  import OutputRepresentationBar from './OutputRepresentationBar'
  import ConnectorsCanvas from './ConnectorsCanvas'

  export default {
    name: 'source-channel',
    components: {
      OutputBlock, OutputRepresentationBar, ConnectorsCanvas
    },
    data () {
      return {
        numberAudioOutputs: 2,
        numberVideoOutputs: 1,
        audioConnectors: { sockets: [], boxes: [] },
        videoConnectors: { sockets: [], boxes: [] },
        /** @type GroupedConnectors[] */
        outputSockets: [],
        /** @type GroupedConnectors[] */
        outputBoxes: [],
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
      channelName (n) {
        const names = ['Mono', 'L', 'R']
        let name = n
        if (this.numberAudioOutputs === 2) {
          name = names[n]
        } else if (this.numberAudioOutputs === 1) {
          name = names[0]
        }
        return name
      },
      channelType (n) {
        return 'Loudspeaker'
      },
      videoChannelName (n) {
        return n
      },
      videoChannelType (n) {
        return ['', 'Monitor', 'Projection'][n % 3 || 1]
      },
      updateOutputsBoxes (type, boxesBounds) {
        this.outputBoxes[type] = boxesBounds
        this.trigger ++ // TODO find better way to trigger the update in the canvas
      },
      updateOutputs (type, sockets) {
        this.outputSockets[type] = sockets
        if (type === 'audio') {
          this.numberAudioOutputs = sockets.length
        } else {
          this.numberVideoOutputs = sockets.length
        }
        this.barTrigger ++ // TODO find better way to trigger the update in the bar
      },
      collectConnectorsData (refName) {
        const bounds = []
        this.$refs[refName].forEach(socketEl => {
          bounds.push(socketEl.getBoundingClientRect())
        })
        return bounds
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
        
        span {
          display: block;
          height: $module-size/2;
          line-height: $module-size/2;
          white-space: nowrap;
          
          &.path {
            font-size: 110%;
            color: $button-text-color;
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