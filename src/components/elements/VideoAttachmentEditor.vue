<template>
  <div class="attachment">
    <div class="row">
      <input type="url" id="video-attachment-url" v-model="url" placeholder="Video URL (at the moment we support only Vimeo links)"
             title="video preview url"/>
    </div>
    <div class="description">right now we support only Vimeo links<br><br></div>
    <div class="video-preview-box close" ref="videoPreviewBox">
    <video-player v-if="displayUrl" :videoUrl="displayUrl" :ratio="ratio"/>
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
    computed: {
      url: {
        set (newValue) {
          this.videoUrl = newValue
          this.setUrl(newValue)
        },
        get () {
          if (this.videoUrl !== null) {
            return this.videoUrl
          }
          return this.video.storage ? this.video.storage.displayUrl : null
        }
      },
      caption: {
        set (newValue) {
          this.videoCaption = newValue
          this.setCaption(newValue)
        },
        get () {
          if (this.videoCaption !== null) {
            return this.videoCaption
          }
          return this.video.caption
        }
      },
      displayUrl () {
        return this.video.storage ? this.video.storage.displayUrl : null
      },
      ratio () {
        return this.video ? this.video.ratio : 1
      }
    },
    data () {
      return {
        video: this.value || VideoAttachment.empty(),
        videoUrl: null,
        videoCaption: null,
        error: null
      }
    },
    methods: {
      setUrl (url) {
        VideoAttachment.fromUrl(url).then(video => {
          if (video) {
            this.error = null
            this.$emit('input', VideoAttachment.fromJson(JSON.parse(JSON.stringify(video))))
            this.togglePreviewBox(true)
          } else {
            this.error = 'It doesn\'t look like a correct Vimeo url.'
            this.togglePreviewBox(false)
          }
        }).catch(error => {
          this.error = error ? error.message : null
        })
      },
      setCaption (caption) {
        this.video.caption = caption
        this.$emit('input', VideoAttachment.fromJson(JSON.parse(JSON.stringify(this.video))))
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
      value (newValue) {
        this.video = newValue || VideoAttachment.empty()
        this.togglePreviewBox(this.displayUrl && !this.error)
      }
    }
  }
</script>
