<template>
  <div class="attachment">
    <label for="url">Vimeo Url</label>
    <input id="url" type="url"
           v-model="attachment.displayUrl"
           v-on:paste="update"
           v-on:change="update"/>
    <div></div>
    <videoPlayer v-if="attachment.displayUrl && !error"
                 :videoUrl="attachment.displayUrl"
                 :ratio="attachment.ratio">
    </videoPlayer>
    <div v-if="attachment.displayUrl && !error" class="attachment-info">
      {{'Aspect Ratio 1 : ' + Math.round((1 / attachment.ratio) * 100) / 100}}
    </div>
    <div v-if="error" class="warning">{{ error.message }}</div>
    <div v-if="warning" class="warning">{{ warning }}</div>
  </div>
</template>

<script>
  import { AttachmentData, AttachmentVideoData } from '../../models/data-types'
  import VideoPlayer from '../VideoPlayer'
  import axios from 'axios'
  
  export default {
    props: ['attachmentData'],
    components: {
      'videoPlayer': VideoPlayer
    },
    data () {
      return {
        error: '',
        warning: ''
      }
    },
    computed: {
      attachment () {
        console.log('computed:attachment -> this.attachmentData: >>>>>>')
        console.log(this.attachmentData)
        if (this.attachmentData.hasOwnProperty('type') && this.attachmentData.type === 'video') {
          return new AttachmentVideoData(this.attachmentData)
        } else {
          return new AttachmentData(this.attachmentData)
        }
      }
    },
    methods: {
      update () {
        if (this.attachment.displayUrl) {
          // Validate Vimeo url and retrieve info about the video
          const match = this.attachment.displayUrl.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/)
          if (!match) {
            this.error = 'It doesn\'t look like a correct Vimeo URL.'
          } else {
            const _this = this
            const attachment = this.attachment
            const url = encodeURIComponent(this.attachment.displayUrl)
            const oembedUrl = 'https://vimeo.com/api/oembed.json?url=' + url + '&maxwidth=10000'
            axios.get(oembedUrl)
            .then(function (response) {
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

              console.log(data)
              attachment.type = 'video'
              console.log('data.width: >>>>>>')
              console.log(data.width)
              console.log('data.height: >>>>>>')
              console.log(data.height)
              attachment.ratio = data.width / data.height
              attachment.duration = data.duration
              attachment.thumbnail.displayUrl = data.thumbnail_url
              attachment.thumbnail.ratio = data.thumbnail_width / data.thumbnail_height

              _this.warning = (parseInt(data.is_plus) === 0) ? 'This video is from <b>Basic</b> Vimeo account.' : ''
              _this.error = ''
            })
            .catch(function (error) {
              console.log(error)
              _this.error = error
            })
          }
        }
        this.$emit('changed', this.attachment)
      }
    }
  }
</script>