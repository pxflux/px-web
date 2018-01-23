<template>
  <div class="attachment">
    <label for="url">Vimeo Url</label>
    <input id="url" type="url" v-model="displayUrl" v-on:paste="update" v-on:change="update"/>
    <div></div>
    <videoPlayer v-if="displayUrl && !error" :videoUrl="displayUrl" :ratio="ratio"/>
    <div v-if="displayUrl && !error" class="attachment-info">
      {{'Aspect Ratio 1 : ' + Math.round((1 / ratio) * 100) / 100}}
    </div>
    <div v-if="error" class="warning">{{ error }}</div>
    <div v-if="warning" class="warning">{{ warning }}</div>
  </div>
</template>

<script>
  import { VideoAttachment } from '../../data/VideoAttachment'
  import VideoPlayer from '../VideoPlayer'
  import axios from 'axios'
  import { AttachmentStorage } from '../../data/AttachmentStorage'
  import { ImageAttachment } from '../../data/ImageAttachment'

  export default {
    components: {VideoPlayer},
    props: {
      attachment: VideoAttachment
    },
    data () {
      return {
        displayUrl: this.attachment.storage.displayUrl,
        ratio: this.attachment.ratio,
        error: '',
        warning: ''
      }
    },
    methods: {
      update () {
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
              const thumbnail = new ImageAttachment(new AttachmentStorage(data.thumbnail_url), data.thumbnail_width / data.thumbnail_height)
              const attachment = new VideoAttachment(new AttachmentStorage(this.displayUrl), this.ratio, data.duration, thumbnail)
              this.$emit('changed', attachment)

              this.warning = (parseInt(data.is_plus) === 0) ? 'This video is from <b>Basic</b> Vimeo account.' : ''
              this.error = ''
            }.bind(this)).catch(function (error) {
              console.log(error)
              this.error = error.message
            }.bind(this))
          }
        }
      }
    }
  }
</script>
