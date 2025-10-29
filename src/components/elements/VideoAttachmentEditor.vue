<template>
  <div class="attachment">
    <div class="row">
      <input type="url"
             id="video-attachment-url"
             v-model="url"
             placeholder="Video URL (at the moment we support only Vimeo links)"
             title="video preview url"/>
    </div>
    <div class="video-preview-box close"
         ref="videoPreviewBox"
         :style="'padding-bottom:'+ (100 / ratio) +'%'">
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

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { VideoAttachment } from '../../models/VideoAttachment'
import VideoPlayer from '../VideoPlayer.vue'
import AutosizeTextarea from './UI/AutosizeTextarea.vue'

const props = defineProps({
  value: VideoAttachment
})

const emit = defineEmits(['input'])

const video = ref(props.value || VideoAttachment.empty())
const videoUrl = ref(null)
const videoCaption = ref(null)
const error = ref(null)
const videoPreviewBox = ref(null)

const url = computed({
  set(newValue) {
    videoUrl.value = newValue
    setUrl(newValue)
  },
  get() {
    if (videoUrl.value !== null) {
      return videoUrl.value
    }
    return video.value.storage ? video.value.storage.displayUrl : null
  }
})

const caption = computed({
  set(newValue) {
    videoCaption.value = newValue
    setCaption(newValue)
  },
  get() {
    if (videoCaption.value !== null) {
      return videoCaption.value
    }
    return video.value.caption
  }
})

const displayUrl = computed(() => {
  return video.value.storage ? video.value.storage.displayUrl : null
})

const ratio = computed(() => {
  return video.value ? video.value.ratio : 1
})

const setUrl = (urlValue) => {
  VideoAttachment.fromUrl(urlValue).then(videoData => {
    if (videoData) {
      error.value = null
      emit('input', VideoAttachment.fromJson(JSON.parse(JSON.stringify(videoData))))
    } else {
      error.value = 'It doesn\'t look like a correct Vimeo url.'
    }
  }).catch(err => {
    error.value = err ? err.message : null
  })
}

const setCaption = (captionValue) => {
  video.value.caption = captionValue
  emit('input', VideoAttachment.fromJson(JSON.parse(JSON.stringify(video.value))))
}

watch(() => props.value, (newValue) => {
  video.value = newValue || VideoAttachment.empty()
})

onMounted(() => {
})
</script>
