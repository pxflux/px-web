<template>
  <main>
    <div v-if="user && accountArtist" class="wrap-content text-block">
      <h1>{{ accountArtist.fullName }}</h1>
      <img v-show="photoUrl" :src="photoUrl">
      <button v-show="photoUrl" @click="removePhoto">Remove photo</button>
      <form v-show="!loading" @submit.prevent="uploadPhoto">
        <input type="file" accept="image/*" @change="upload">
        <input v-if="fileExtension" type="submit" value="Upload">
      </form>
      <ul>
        <li><a @click="removeArtist" class="button">Remove</a></li>
      </ul>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    data () {
      return {
        loading: false,
        photoUrl: null,
        uploadedFile: null,
        fileExtension: null,
        preview: null
      }
    },
    computed: {
      ...mapState(['user', 'accountArtist'])
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_ARTIST']),

      init () {
        if (this.user.uid) {
          this.source = firebase.database().ref('artists/' + this.$route.params.id)
          this.setRef({key: 'accountArtist', ref: this.source})
        } else {
          this.source = null
          this.REMOVE_ACCOUNT_ARTIST()
        }
      },

      upload (event) {
        const files = event.target.files || event.dataTransfer.files
        if (files && files[0]) {
          switch (files[0].type) {
            case 'image/jpeg':
            case 'image/jpg':
              this.fileExtension = 'jpg'
              break
            case 'image/png':
              this.fileExtension = 'png'
              break
            default:
              return
          }
          this.uploadedFile = files[0]
          const reader = new FileReader()
          reader.onload = function (e) {
            this.loading = false
            this.$bar.finish()
            this.preview = e.target.result
          }.bind(this)
          this.loading = true
          this.$bar.start()
          reader.readAsDataURL(this.uploadedFile)
        }
      },

      uploadPhoto () {
        if (this.uploadedFile && this.fileExtension) {
          this.loading = true
          this.$bar.start()
          this.source.update({photoUrl: '/static/img/spin-32.gif'}).then(function () {
            const filePath = '/artists/' + this.$route.params.id + '.' + this.fileExtension
            return firebase.storage().ref(filePath).put(this.uploadedFile).then(function (snapshot) {
              const fullPath = snapshot.metadata.fullPath
              return this.source.update({photoUrl: firebase.storage().ref(fullPath).toString()})
            }.bind(this))
          }.bind(this)).then(function () {
            this.loading = false
            this.$bar.finish()
          }.bind(this)).catch(function (error) {
            log(error)
            this.loading = false
            this.$bar.finish()
          }.bind(this))
        }
      },

      removePhoto () {
        const imageUri = this.accountArtist.photoUrl
        if (imageUri) {
          this.loading = true
          this.$bar.start()
          this.source.update({photoUrl: null}).then(function () {
            if (imageUri.startsWith('gs://')) {
              return firebase.storage().refFromURL(imageUri).delete()
            }
          }).then(function () {
            this.loading = false
            this.$bar.finish()
          }.bind(this)).catch(function (error) {
            log(error)
            this.loading = false
            this.$bar.finish()
          }.bind(this))
        }
      },

      setImageUrl (imageUri) {
        // If the image is a Cloud Storage URI we fetch the URL.
        if (imageUri && imageUri.startsWith('gs://')) {
          this.photoUrl = '/static/img/spin-32.gif'
          firebase.storage().refFromURL(imageUri).getMetadata().then(function (metadata) {
            this.photoUrl = metadata.downloadURLs[0]
          }.bind(this))
        } else {
          this.photoUrl = imageUri
        }
      },

      removeArtist () {
        if (this.source) {
          this.REMOVE_ACCOUNT_ARTIST()
          this.source.remove(log)
          this.$router.push('/account/artists')
        }
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'user' () {
        this.init()
      },
      'accountArtist' () {
        this.setImageUrl(this.accountArtist.photoUrl)
      }
    }
  }
</script>
