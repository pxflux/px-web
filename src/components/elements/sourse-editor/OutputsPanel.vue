<template>
  <div>
    <connectors-canvas v-if="outputsPanelOpen" :start-connectors="outputSockets" :end-connectors="outputBoxes"
                       :colors="colors" :trigger="trigger"/>
    <section class="outputs-editor-panel row" ref="outputEditor">
      <label class="with-icon" @click="outputsPanelOpen = !outputsPanelOpen">
        <span class="icon arrow-right small" :class="[outputsPanelOpen? 'open' : '']"></span>
        <span>Outputs</span>
      </label>

      <div v-if="outputsPanelOpen" class="outputs-control-panel field">
        <output-control-panel
          ref="outputControls"
          v-for="(output, i) in outputTypes"
          :key="i"
          :num-outputs="numberOutputs[output.type]"
          :output-title="output.title"
          :type="output.type"
          v-on:update="updateOutputsNumber(...arguments)"/>
      </div>
      <div v-else="" class="field closed" @click="outputsPanelOpen = !outputsPanelOpen">
        <span class="description">{{outputsSummary()}}</span>
      </div>
    </section>

    <section>
      <div v-if="outputsPanelOpen" class="outputs-presentation">
        <output-representation-bar
          ref="outputBars"
          v-for="(output, i) in outputTypes"
          :key="i"
          :type="output.type"
          :outputs-number="numberOutputs[output.type]"
          :output-list="outputs[output.type]"
          v-on:update="updateOutputs(...arguments)"
          :trigger="barTrigger"/>
      </div>
      <div v-if="outputsPanelOpen" class="row">
        <label><span>Summary</span></label>
        <div class="field">
          <span class="description">{{outputsSummary()}}</span>
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
  import commonResolutions from '../../../models/utilities/standard-resolutions'

  export default {
    name: 'outputs-panel',

    components: {
      OutputControlPanel,
      OutputRepresentationBar,
      ConnectorsCanvas,
      VueSelect
    },
    data () {
      return {
        outputsPanelOpen: false,
        channelObject: null,
        outputs: {
          audio: [{type: 'loudspeaker'}, {type: 'loudspeaker'}],
          video: [{type: 'any', resolution: [0, 0], orientation: 'landscape'}]
        },
        numberOutputs: {audio: 2, video: 1},
        /** @type GroupedConnectors[] */
        outputSockets: [],
        /** @type GroupedConnectors[] */
        outputBoxes: [],
        outputTypes: [
          {type: 'audio', title: 'Audio'},
          {type: 'video', title: 'Video'}
        ],
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
        // this.$refs.sourceEditor.style.left = this.curPanelLeft + 'px'
        this.$refs.outputEditor.style.left = this.curPanelLeft + 'px'
        this.refreshOutputConnections()
        if (this.curPanelLeft !== targetLeft) {
          requestAnimationFrame(() => {
            this.animatePanelsLeft(targetLeft, step)
          })
        }
      },
      outputsSummary () {
        if (this.channelObject && this.channelObject.hasOwnProperty('toString')) {
          return this.channelObject.toString()
        } else {
          // Just for testing layout and as a simplified example:
          const numberAudio = this.numberOutputs.audio
          let audioDesc = 'Sound: '
          switch (numberAudio) {
            case 0:
              audioDesc = 'No sound'
              break
            case 1:
              audioDesc += 'mono'
              break
            case 2:
              audioDesc += 'stereo'
              break
            default:
              audioDesc += `${numberAudio} channels`
          }
          return `${this.displaysStatsString()} | ${audioDesc}`
        }
      },
      displaysStatsString () {
        const displayStats = {}
        this.outputs.video.forEach(v => {
          let resStr = 'any'
          if (v.resolution[0]) {
            const w = Math.max(v.resolution[0], v.resolution[1])
            const h = Math.min(v.resolution[0], v.resolution[1])
            const res = commonResolutions.closestStandardForSize({w: w, h: h})
            resStr = res ? res.abr : `(${w} x ${h} px)`
          }
          if (!displayStats.hasOwnProperty(v.type)) displayStats[v.type] = {}
          if (!displayStats[v.type].hasOwnProperty(resStr)) displayStats[v.type][resStr] = 0
          displayStats[v.type][resStr]++
        })
        let displayStatsStr = ''
        for (let type in displayStats) {
          if (!displayStats.hasOwnProperty(type)) continue
          for (let res in displayStats[type]) {
            if (!displayStats[type].hasOwnProperty(res)) continue
            let number = displayStats[type][res]
            if (res === 'any') res = ''
            if (type === 'any') {
              type = 'display'
              if (number > 1) type += 's'
              type += ' of any type'
            } else {
              if (number > 1) type += 's'
            }
            if (number === 1) number = 'Single'
            if (displayStatsStr) displayStatsStr += ', '
            displayStatsStr += `${number} ${res} ${type}`
          }
        }
        if (!displayStatsStr) displayStatsStr = 'No video'
        return displayStatsStr
      }
    }
  }
</script>
