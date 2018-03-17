<template>
  <div class="attachment">
    <div class="row">
      <input type="url" v-model="displayUrl" v-on:paste="update" v-on:change="update"/>
    </div>
    <div class="description">right now we support only Vimeo links<br><br></div>
    <videoPlayer v-if="displayUrl && !error" :videoUrl="displayUrl" :ratio="ratio"/>
    <div v-if="displayUrl && !error" class="attachment-info">
      {{'Aspect Ratio 1 : ' + Math.round((1 / ratio) * 100) / 100}}
    </div>
    <div v-if="error" class="warning">{{ error }}</div>
    <div v-if="warning" class="warning">{{ warning }}</div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { VideoAttachment } from '../../models/VideoAttachment'
  import { AttachmentStorage } from '../../models/AttachmentStorage'
  import { ImageAttachment } from '../../models/ImageAttachment'
  import VideoPlayer from '../VideoPlayer'

  export default {
    components: {VideoPlayer},
    props: {
      value: VideoAttachment
    },
    data () {
      return {
        displayUrl: '',
        ratio: '',
        error: '',
        warning: ''
      }
    },
    methods: {
      update () {
        console.log('--> this.displayUrl: >>>>>>')
        console.log(this.displayUrl)
        if (this.displayUrl) {
          // Validate Vimeo url and retrieve info about the video
          const match = this.displayUrl.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/)
          if (!match) {
            this.error = 'It doesn\'t look like a correct Vimeo URL.'
          } else {
            const url = 'https://vimeo.com/api/oembed.json?url=' + encodeURIComponent(this.displayUrl) + '&maxwidth=10000'
            axios.get(url).then(function (response) {
              /**
               * @type {{
               *   account_type: string
               *   author_name: string
               *   duration: number
               *   height: number
               *   html: string
               *   is_plus: string
               *   thumbnail_height: number
               *   thumbnail_url: string
               *   thumbnail_url_with_play_button: string
               *   thumbnail_width: number
               *   video_id: number
               *   width: number
               * }}
               */
              const data = response.data
              this.ratio = data.width / data.height
              this.warning = (parseInt(data.is_plus) === 0) ? 'This video is from <b>Basic</b> Vimeo account.' : ''
              this.error = ''

              const thumbnail = new ImageAttachment(new AttachmentStorage(data.thumbnail_url, null, null), null, data.thumbnail_width / data.thumbnail_height)
              const attachment = new VideoAttachment(new AttachmentStorage(this.displayUrl, null, null), null, this.ratio, data.duration, thumbnail)
              this.$emit('input', attachment)
            }.bind(this)).catch(function (error) {
              console.log(error)
              this.error = error.message
            }.bind(this))
          }
        }
      }
    },
    watch: {
      value: function () {
        this.displayUrl = this.value.storage.displayUrl
        this.ratio = this.value.ratio
      }
    }
  }
</script>
