<template>
  <div class="channel" ref="channel">
    <connectors-canvas
      v-if="sourceIsOK && outputsPanelOpen"
      :start-connectors="outputSockets"
      :end-connectors="outputBoxes"
      :colors="colors"
      :trigger="trigger">
    </connectors-canvas>
    <section class="source-editor-panel row" ref="sourceEditor">
      <label for="sourceUrl">
        <span>Source</span>
      </label>
      <div class="source-editor field">
        <div class="source-wrapper">
          <input
            class="path"
            id="sourceUrl"
            name="sourceUrl"
            placeholder="Add source URL here"
            v-model="source"
            v-on:paste="updateSource" @change="updateSource"/>
          <span class="description">{{sourceDescription}}</span>
        </div>
      </div>
    </section>

    <section v-if="sourceIsOK" class="outputs-editor-panel row" ref="outputEditor">
      <label class="with-icon" @click="outputsPanelOpen = !outputsPanelOpen">
          <span class="icon arrow-right small"
                :class="[outputsPanelOpen? 'open' : '']"></span>
        <span>Outputs</span>
      </label>

      <div v-if="outputsPanelOpen"
           class="outputs-control-panel field">
        <output-control-panel
          v-for="(output, i) in outputTypes" ref="outputControls"
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
          v-for="(output, i) in outputTypes"
          :key="i"
          ref="outputBars"
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

    <section>
      <div class="row">
        <label><span>Image</span></label>
        <div class="field">
          <!--<image-attachment-editor v-model="artwork.thumbnail"/>-->
        </div>
      </div>
      <div class="row">
        <label><span>Video Preview</span></label>
        <div class="field">
          <!--<video-attachment-editor v-model="artwork.preview"/>-->
        </div>
      </div>
    </section>
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
  import commonResolutions from '../../../models/old-models/display-resolutions'
  import { SourceURL } from '../../../models/SourceURL'

  export default {
    name: 'source-channel',
    props: ['value'],
    components: {
      OutputControlPanel,
      OutputRepresentationBar,
      ConnectorsCanvas,
      VueSelect
    },
    mixins: [vimeoLink],
    data () {
      return {
        channelObject: null,
        source: this.value.url,
        sourceIsOK: false,
        sourceDescription: 'URL (HTML/Javascript or Vimeo video link)',
        outputsPanelOpen: false,
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
      updateSource () {
        this.sourceDescription = ''
        const url = this.source
        if (this.getVimeoVideoIdFromUrl(url)) {
          this.getVimeoVideoInfo(url, (/** @type VimeoVideoInfo */ vimeoInfo) => {
            this.sourceDescription = `Vimeo video ${vimeoInfo.width} x ${vimeoInfo.height} px | [${vimeoInfo.duration}]`
          })
          this.sourceIsOK = true
        } else {
          const requestUrl = 'https://50artistsnet.ipage.com/url-to-headers/index.php?url=' + encodeURIComponent(url)
          axios.post(requestUrl).then(function (response) {
            console.log(response)
            if (typeof response.data === 'object' &&
              response.data.hasOwnProperty('Content-Type')) {
              this.sourceDescription = response.data['Content-Type']
              this.sourceIsOK = true
            } else {
              this.sourceDescription = 'The URL is not valid.'
              this.sourceIsOK = false
              this.outputsPanelOpen = false
            }
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
        this.$refs.sourceEditor.style.left = this.curPanelLeft + 'px'
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
          return `${this.sourceDescription} | ${this.displaysStatsString()} | ${audioDesc}`
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
    },
    watch: {
      value: function () {
        this.source = this.value.url
      },
      sourceIsOK: function () {
        if (this.sourceIsOK) {
          this.$emit('input', new SourceURL(null, this.source))
        }
      }
    }
  }
</script>
