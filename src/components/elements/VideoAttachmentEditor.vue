<template>
  <div class="attachment">
    <div class="row">
      <input
        id="video-attachment-url"
        type="url"
        v-model="displayUrl"
        v-on:paste="update"
        v-on:change="update"
        placeholder="Video URL (at the moment we support only Vimeo links)"
        title="video preview url"/>
    </div>
    <div class="video-preview-box close" ref="videoPreviewBox">
      <video-player
        v-if="displayUrl && !error"
        :videoUrl="displayUrl"
        :ratio="ratio"/>
    </div>
    <autosize-textarea
      v-if="displayUrl && !error"
      :model="caption"
      :placeholder="'Caption'"
      :css-class="'caption'"/>
    <div v-if="error" class="warning">{{ error }}</div>
  </div>
</template>

<script>
  import { VideoAttachment } from '../../models/VideoAttachment'
  import VideoPlayer from '../VideoPlayer'
  import AutosizeTextarea from './UI/AutosizeTextarea'

  export default {
    components: { VideoPlayer, AutosizeTextarea },
    props: {
      value: VideoAttachment
    },
    data () {
      return {
        displayUrl: '',
        ratio: 1,
        error: null,
        caption: ''
      }
    },
    methods: {
      update () {
        VideoAttachment.fromUrl(this.displayUrl).then(attachment => {
          if (attachment) {
            this.ratio = attachment.ratio
            this.error = null
            attachment.caption = this.caption

            this.togglePreviewBox(true)
          } else {
            this.error = 'It doesn\'t look like a correct Vimeo url.'
            this.togglePreviewBox(false)
          }
          this.$emit('input', attachment)
        }).catch(error => {
          console.log(error)
          this.error = error ? error.message : null
        })
      },

      togglePreviewBox (on) {
        if (!this.$refs['videoPreviewBox']) return

        if (on) {
          const width = this.$refs['videoPreviewBox'].getBoundingClientRect().width
          this.$refs['videoPreviewBox'].style.height = width / this.ratio + 'px'
        } else {
          this.$refs['videoPreviewBox'].style.height = 0
        }
      }
    },
    watch: {
      value: function () {
        this.displayUrl = this.value && this.value.storage ? this.value.storage.displayUrl : ''
        this.ratio = this.value ? this.value.ratio : 1
        this.togglePreviewBox(this.displayUrl && !this.error)
      }
    }
  }
</script>
