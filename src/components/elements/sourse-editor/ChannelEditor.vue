<template>
  <div class="channel" ref="channel">
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
            v-model="url"
            v-on:paste="updateSource" @change="updateSource"/>
          <span class="description">{{sourceDescription}}</span>
        </div>
      </div>
    </section>
    
    <outputs-panel v-if="sourceIsOK" ref="outputsPanel"/>
  </div>
</template>

<script>
  import VueSelect from '../UI/Select/components/Select'
  import OutputsPanel from './OutputsPanel'
  import { AWChannel } from '../../../models/AWChannel'

  export default {
    name: 'channel-editor',
    props: ['value'],
    components: {
      VueSelect,
      OutputsPanel
    },

    data () {
      return {
        channel: new AWChannel(this.value),
        source: null,
        audioOutputs: null,
        videoOutputs: null,
        url: '',
        sourceIsOK: false,
        sourceDescription: '',
        defaultSourceDescription: 'URL (HTML/Javascript or Vimeo video link)'
      }
    },

    methods: {
      resetChannel (value) {
        this.channel = new AWChannel(value)
        this.source = this.channel.source
        if (typeof this.source.url === 'string') {
          this.source.updateUrl(this.source.url, isOK => {
            this.sourceIsOK = isOK
            this.url = this.source.url
            this.sourceDescription = this.source.toString()
          })
        } else {
          this.sourceIsOK = false
          this.url = ''
          this.sourceDescription = this.defaultSourceDescription
        }
        this.audioOutputs = this.channel.audioOutputs
        this.videoOutputs = this.channel.videoOutputs
      },

      updateSource () {
        this.sourceDescription = ''
        this.channel.source.updateUrl(this.url, isOK => {
          this.sourceIsOK = isOK
          this.sourceDescription = this.channel.source.toString()
          this.$emit('input', this.channel)
        })
      },

      fixPanelsOnScroll (e) {
        this.$refs['outputsPanel'].fixPanelsOnScroll(e)
      }
    },

    mounted () {
      this.sourceDescription = this.defaultSourceDescription
    },

    watch: {
      value () { this.resetChannel(this.value) }
    }
  }
</script>
