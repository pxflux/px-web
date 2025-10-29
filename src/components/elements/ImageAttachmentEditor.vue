<template>
    <image-upload id="image" :imageUrl="imageUrl" @input-file="setImageFile" @remove-image="setImageRemoved"/>
</template>

<script setup>
import { ref, watch } from 'vue'
import ImageUpload from '../elements/ImageUpload.vue'
import { ImageAttachment } from '../../models/ImageAttachment'
import { AttachmentStorage } from '../../models/AttachmentStorage'

const props = defineProps({
  value: ImageAttachment
})

const emit = defineEmits(['input'])

const imageUrl = ref(props.value ? props.value.storage.displayUrl : null)
const imageRemoved = ref(false)

const setImageFile = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    const image = new Image()
    image.src = e.target.result
    image.onload = function () {
      const storage = new AttachmentStorage(null, null, file)
      const attachment = new ImageAttachment(storage, this.width / this.height)
      emit('input', attachment)
    }
  }
}

const setImageRemoved = (flag) => {
  emit('input', ImageAttachment.empty())
}

watch(() => props.value, () => {
})
</script>
