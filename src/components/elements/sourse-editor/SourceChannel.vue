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
            v-model="source"
            v-on:paste="updateSource" @change="updateSource"/>
          <span class="description">{{sourceDescription}}</span>
        </div>
      </div>
    </section>

    <outputs-panel v-if="sourceIsOK" ref="outputsPanel"/>

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
  import axios from 'axios'

  import VueSelect from '../UI/Select/components/Select'
  import OutputsPanel from './OutputsPanel'

  import vimeoLink from '../../../helpers/vimeoLink'
  import { SourceURL } from '../../../models/SourceURL'

  export default {
    name: 'source-channel',
    props: ['value'],
    components: {
      VueSelect,
      OutputsPanel
    },
    mixins: [vimeoLink],
    data () {
      return {
        source: this.value.url,
        sourceIsOK: false,
        sourceDescription: 'URL (HTML/Javascript or Vimeo video link)'
      }
    },
    methods: {
      setSource (url) {
        if (this.source !== url) {
          this.source = url
          this.sourceIsOK = false
          this.sourceDescription = 'URL (HTML/Javascript or Vimeo video link)'
        }
      },
      updateSource () {
        this.sourceDescription = ''
        if (this.isVimeoVideoUrl(this.source)) {
          this.getVimeoVideoInfo(this.source).then((vimeoInfo) => {
            console.log(vimeoInfo)
            this.sourceIsOK = true
            this.sourceDescription = `Vimeo video ${vimeoInfo.width} x ${vimeoInfo.height} px | [${vimeoInfo.duration}]`
            this.$emit('input', new SourceURL(null, this.source))
          })
        } else {
          const requestUrl = 'https://50artistsnet.ipage.com/url-to-headers/index.php?url=' + encodeURIComponent(this.source)
          axios.post(requestUrl).then((response) => {
            console.log(response)
            if (typeof response.data === 'object' && response.data.hasOwnProperty('Content-Type')) {
              this.sourceIsOK = true
              this.sourceDescription = response.data['Content-Type']
              this.$emit('input', new SourceURL(null, this.source))
            } else {
              this.sourceIsOK = false
              this.sourceDescription = 'The URL is not valid.'
              this.$emit('input', SourceURL.empty())
            }
          })
        }
      },
      fixPanelsOnScroll (e) {
        this.$refs['outputsPanel'].fixPanelsOnScroll(e)
      }
    },
    watch: {
      value: function () {
        this.setSource(this.value.url)
      }
    }
  }
</script>
