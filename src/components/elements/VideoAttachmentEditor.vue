<template>
  <div class="attachment">
    <div class="row">
      <input type="url" v-model="displayUrl" v-on:paste="update" v-on:change="update"/>
    </div>
    <div class="description">right now we support only Vimeo links<br><br></div>
    <video-player
            v-if="displayUrl && !error"
            :videoUrl="displayUrl"
            :ratio="ratio"/>
    <div v-if="displayUrl && !error" class="attachment-info">
      {{'Aspect Ratio 1 : ' + Math.round((1 / ratio) * 100) / 100}}
    </div>
    <div v-if="error" class="warning">{{ error }}</div>
  </div>
</template>

<script>
  import { VideoAttachment } from '../../models/VideoAttachment'
  import VideoPlayer from '../VideoPlayer'
  
  export default {
    components: {VideoPlayer},
    props: {
      value: VideoAttachment
    },
    data () {
      return {
        displayUrl: '',
        ratio: 1,
        error: null
      }
    },
    methods: {
      update () {
        VideoAttachment.fromUrl(this.displayUrl).then(attachment => {
          if (attachment) {
            this.ratio = attachment.ratio
            this.error = null
          } else {
            this.error = 'It doesn\'t look like a correct Vimeo url or from <b>Basic</b> Vimeo account.'
          }
          this.$emit('input', attachment)
        }).catch(error => {
          console.log(error)
          this.error = error ? error.message : null
        })
      }
    },
    watch: {
      value: function () {
        this.displayUrl = this.value && this.value.storage ? this.value.storage.displayUrl : ''
        this.ratio = this.value ? this.value.ratio : 1
      }
    }
  }
</script>
