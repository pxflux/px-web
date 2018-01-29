<template>
  <div class="attachments" id="AAA">
    <div class="display">
      <video-player v-if="preview"
                    :videoUrl="preview.displayUrl"
                    :ratio="preview.ratio">
      </video-player>
      <div>
        <img v-show="image.displayUrl" :src="image.displayUrl">
      </div>
    </div>
    <div class="toolbar">
      <div class="controls">
        <div class="video-player">
          <div class="button play">
            <div class="icon play"></div>
          </div>
          <div class="button sound">
            <div class="icon">
              sound
            </div>
          </div>
        </div>
        <div class="caption">
          Here is the caption for the above photograph or video
        </div>
      </div>
      <a href="#" class="button">
        <div class="icon arrow-left"></div>
      </a>
      <a class="button">
        <div class="icon arrow-right"></div>
      </a>
    </div>
  </div>
</template>

<script>
  import VideoPlayer from '../VideoPlayer'

  export default {
    props: ['preview', 'image'],
    components: {
      'video-player': VideoPlayer
    }
  }
</script>

<style scoped>

</style>