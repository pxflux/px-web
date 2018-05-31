<template>
  <div class="outputs-editor-wrapper">
    <connectors-canvas v-if="panelOpened" :start-connectors="outputSockets" :end-connectors="outputBoxes"
                       :colors="colors" :trigger="trigger"/>
    <section class="outputs-editor-panel row" ref="outputEditor">
      <label class="with-icon" @click="panelOpened = !panelOpened">
        <span class="icon arrow-right small" :class="[panelOpened? 'open' : '']"></span>
        <span>Outputs</span>
      </label>

      <div v-if="panelOpened" class="outputs-control-panel field">
        <output-control-panel
          ref="outputControls"
          v-for="(outputType, i) in outputTypes"
          :key="i"
          :value="outputType"
          v-on:append="appendOutputs($event)"
          v-on:remove="removeOutputs($event)"/>
      </div>
      <div v-else="" class="field closed" @click="panelOpened = !panelOpened">
        <span class="description">{{description}}</span>
      </div>
    </section>

    <section>
      <div v-if="panelOpened" class="outputs-presentation">
        <output-representation-bar
          ref="outputBars"
          v-for="(outputType, i) in outputTypes"
          :key="i"
          :value="outputType"
          :trigger="barTrigger"
          v-on:update="updateOutputs(...arguments)"/>
      </div>
      <div v-if="panelOpened" class="row">
        <label><span>Summary</span></label>
        <div class="field">
          <span class="description">{{description}}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import OutputControlPanel from './OutputControlPanel'
  import OutputRepresentationBar from './OutputRepresentationBar'
  import ConnectorsCanvas from './ConnectorsCanvas'
  import VueSelect from '../UI/Select/components/Select'
  import { AWChannel } from '../../../models/AWChannel'
  import { AWAudioOutputs } from '../../../models/AWAudioOutput'
  import { AWVideoOutputs } from '../../../models/AWVideoOutput'

  export default {
    name: 'outputs-panel',
    components: {
      OutputControlPanel,
      OutputRepresentationBar,
      ConnectorsCanvas,
      VueSelect
    },
    props: {
      value: AWChannel
    },

    computed: {
      outputTypes () {
        return [
          {code: 'audio', title: 'Audio', data: this.channel.audioOutputs},
          {code: 'video', title: 'Video', data: this.channel.videoOutputs}
        ]
      },
      description () {
        return this.channel.toString()
      }
    },
    data () {
      return {
        channel: this.value || AWChannel.empty(),

        panelOpened: false,
        /** @type GroupedConnectors[] */
        outputSockets: [],
        /** @type GroupedConnectors[] */
        outputBoxes: [],
        colors: {
          video: 'rgba(115, 253, 234, 0.6)',
          audio: 'rgba(248, 186, 0, 0.6)'
        },
        trigger: 0,
        barTrigger: 0,
        curPanelLeft: 0,
        leftMargin: null,
        scrollTimeout: null
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.refreshOutputConnections()
      })
    },
    methods: {
      update () {
        this.$emit('input', AWChannel.fromJson(JSON.parse(JSON.stringify(this.channel))))
        this.refreshOutputConnections()
      },
      appendOutputs (type) {
        if (type === 'audio') {
          AWAudioOutputs.append(this.channel.audioOutputs)
          this.update()
        }
        if (type === 'video') {
          AWVideoOutputs.append(this.channel.videoOutputs)
          this.update()
        }
      },
      removeOutputs (type) {
        if (type === 'audio') {
          AWAudioOutputs.remove(this.channel.audioOutputs)
          this.update()
        }
        if (type === 'video') {
          AWVideoOutputs.remove(this.channel.videoOutputs)
          this.update()
        }
      },
      updateOutputs (type, outputs) {
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
      fixPanelsOnScroll (e) {
        clearTimeout(this.scrollTimeout)
        this.scrollTimeout = setTimeout(() => {
          this.animatePanelsLeft(e.target.scrollLeft)
        }, 100)
      },
      animatePanelsLeft (targetLeft, step) {
        if (!step) step = (targetLeft - this.curPanelLeft) / 10
        this.curPanelLeft += step
        if (
          (step > 0 && this.curPanelLeft > targetLeft) ||
          (step < 0 && this.curPanelLeft < targetLeft)) {
          this.curPanelLeft = targetLeft
        }
        this.$refs.outputEditor.style.left = this.curPanelLeft + 'px'
        this.refreshOutputConnections()
        if (this.curPanelLeft !== targetLeft) {
          requestAnimationFrame(() => {
            this.animatePanelsLeft(targetLeft, step)
          })
        }
      }
    },

    watch: {
      value (newValue) {
        this.channel = newValue || AWChannel.empty()
      }
    }
  }
</script>
