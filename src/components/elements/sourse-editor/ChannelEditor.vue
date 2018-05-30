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
            v-on:paste="setUrl" @change="setUrl"/>
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
  import { AWSource } from '../../../models/AWSource'

  export default {
    name: 'channel-editor',
    props: ['value'],
    components: {
      VueSelect,
      OutputsPanel
    },

    data () {
      return {
        channel: this.value || AWChannel.empty(),
        audioOutputs: null,
        videoOutputs: null,
        url: '',
        sourceIsOK: false,
        sourceDescription: '',
        defaultSourceDescription: 'URL (HTML/Javascript or Vimeo video link)'
      }
    },

    methods: {
      setChannel (value) {
        this.channel = value
        if (this.channel.source && this.channel.source.url) {
          AWSource.fromUrl(this.channel.source.url).then(source => {
            this.sourceIsOK = true
            this.url = source.url
            this.channel.source = source
            this.sourceDescription = source.toString()
          }).catch(err => {
            console.log(err)
            this.reset()
          })
        } else {
          this.url = ''
          this.reset()
        }
        this.audioOutputs = this.channel.audioOutputs
        this.videoOutputs = this.channel.videoOutputs
      },

      setUrl () {
        AWSource.fromUrl(this.url).then(source => {
          this.sourceIsOK = true
          this.channel.source = source
          this.sourceDescription = source.toString()
          this.$emit('input', AWChannel.fromJson(JSON.parse(JSON.stringify(this.channel))))
        }).catch(err => {
          console.log(err)
          this.reset()
          this.$emit('input', AWChannel.fromJson(JSON.parse(JSON.stringify(this.channel))))
        })
      },
      reset () {
        this.sourceIsOK = false
        this.channel.source = AWSource.empty()
        this.sourceDescription = this.defaultSourceDescription
      },
      fixPanelsOnScroll (e) {
        this.$refs['outputsPanel'].fixPanelsOnScroll(e)
      }
    },

    mounted () {
      this.sourceDescription = this.defaultSourceDescription
    },

    watch: {
      value () { this.setChannel(this.value) }
    }
  }
</script>
