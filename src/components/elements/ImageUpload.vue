<template>
  <div>
    <!--<img v-if="showUrl" :src="showUrl" width="100" height="100">-->
    <!--<div v-else="" class="no-image" style="width:100px; height:100px"></div>-->
    <!--<input ref="inputImage" type="file" accept="image/*" @change="uploadImage">-->
    <!--<button v-show="!this.removed && (previewUrl || imageUrl)" @click="removeImage">Remove</button>-->
    <!--<button v-show="this.removed" @click="removed = false">Undo</button>-->
    <div v-bind="getRootProps()" class="dropzone">
      <input v-bind="getInputProps()" />
      <p>Drop files here or click to upload</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDropzone } from 'vue3-dropzone'

const props = defineProps({
  imageUrl: String
})

const emit = defineEmits(['input-file', 'remove-image'])

const previewUrl = ref(null)
const removed = ref(false)
const inputImage = ref(null)

const { getRootProps, getInputProps } = useDropzone({
  onDrop: (acceptedFiles) => {
    console.log(acceptedFiles)
  }
})

const originalUrl = computed(() => {
  return removed.value ? null : props.imageUrl
})

const showUrl = computed(() => {
  return previewUrl.value || originalUrl.value
})

const uploadImage = (event) => {
  const files = event.target.files || event.dataTransfer.files
  if (files && files[0]) {
    switch (files[0].type) {
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/gif':
        break
      default:
        return
    }
    const uploadedFile = files[0]
    emit('input-file', uploadedFile)
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(uploadedFile)
  }
}

const removeImage = () => {
  if (inputImage.value) {
    inputImage.value.value = ''
  }
  if (previewUrl.value === null) {
    removed.value = true
    emit('remove-image', true)
  } else {
    previewUrl.value = null
    emit('input-file', null)
  }
}

const undo = () => {
  removed.value = false
  emit('remove-image', false)
}
</script>
