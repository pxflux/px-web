<template>
  <div>
    <img v-show="showUrl" :src="showUrl" width="100" height="100">
    <input ref="inputImage" type="file" accept="image/*" @change="uploadImage">
    <button v-show="!this.removed && (previewUrl || imageUrl)" @click="removeImage">Remove</button>
    <button v-show="this.removed" @click="removed = false">Undo</button>
  </div>
</template>

<script>
  export default {
    props: ['imageUrl'],
    computed: {
      originalUrl: function () {
        return this.removed ? null : this.imageUrl
      },
      showUrl: function () {
        return this.previewUrl || this.originalUrl
      }
    },
    data () {
      return {
        previewUrl: null,
        removed: false
      }
    },
    methods: {
      uploadImage (event) {
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
          this.$emit('input-file', uploadedFile)
          const reader = new FileReader()
          reader.onload = function (e) {
            this.previewUrl = e.target.result
          }.bind(this)
          reader.readAsDataURL(uploadedFile)
        }
      },
      removeImage () {
        this.$refs.inputImage.value = ''
        if (this.previewUrl === null) {
          this.removed = true
          this.$emit('remove-image', true)
        } else {
          this.previewUrl = null
          this.$emit('input-file', null)
        }
      },
      undo () {
        this.removed = false
        this.$emit('remove-image', false)
      }
    }
  }
</script>
