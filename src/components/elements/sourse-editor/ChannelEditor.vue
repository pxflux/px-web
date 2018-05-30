<template>
  <div class="channel-wrapper">
    <div class="channel" ref="channel">
      <section class="source-editor-panel row">
        <label>
          <span>Source</span>
        </label>
        <div class="source-editor field">
          <div class="source-wrapper">
            <input class="path" placeholder="Add source URL here" :name="'url' + index" v-model="url"/>
            <span v-if="error" class="description">{{error}}</span>
            <span v-else class="description">{{sourceDescription}}</span>
          </div>
        </div>
      </section>

      <outputs-panel v-if="this.channel.source" ref="outputsPanel"/>
    </div>
    <div v-if="index" class="button frameless secondary" @click="removeChannel()"><i class="cancel-small"></i></div>
  </div>
</template>

<script>
  import VueSelect from '../UI/Select/components/Select'
  import OutputsPanel from './OutputsPanel'
  import { AWChannel } from '../../../models/AWChannel'
  import { AWSource } from '../../../models/AWSource'

  export default {
    name: 'channel-editor',
    props: ['index', 'value'],
    components: {
      VueSelect,
      OutputsPanel
    },

    computed: {
      url: {
        set (newValue) {
          this.sourceUrl = newValue
          this.setUrl(newValue)
        },
        get () {
          if (this.sourceUrl !== null) {
            return this.sourceUrl
          }
          return this.channel.source ? this.channel.source.url : null
        }
      },
      sourceDescription () {
        return this.channel.source ? this.channel.source.toString() : 'URL (HTML/Javascript or Vimeo video link)'
      }
    },
    data () {
      return {
        channel: this.value || AWChannel.empty(),
        sourceUrl: null,
        error: ''
      }
    },

    methods: {
      removeChannel () {
        this.$emit('remove', this.index)
      },

      setUrl (url) {
        console.log(url)
        AWSource.fromUrl(url).then(source => {
          this.channel.source = source
          this.error = ''
          this.$emit('input', AWChannel.fromJson(JSON.parse(JSON.stringify(this.channel))))
        }).catch(err => {
          this.error = err.message
        })
      },
      fixPanelsOnScroll (e) {
        this.$refs['outputsPanel'].fixPanelsOnScroll(e)
      }
    },

    watch: {
      value (newValue) {
        this.channel = newValue
      }
    }
  }
</script>
