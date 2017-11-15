<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/artists/">Artists</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/artist/' + artistId">{{ accountArtist.title }}</router-link>
      </template>
      <form id="form-artist-icon">
        <img v-show="iconUrl && !previewImage" :src="iconUrl" width="100" height="100">
        <img v-show="previewImage" :src="previewImage" width="100" height="100">
        <input ref="inputImage" type="file" accept="image/*" @change="uploadImage">
        <button v-show="iconUrl || previewImage" @click="removeImage">Remove icon</button>
      </form>
      <form id="form-artist" @submit.prevent="submitArtist">
        <input type="text" v-model="title" title="Artist title" required="required">
        <router-link v-if="isNew" to="/account/artists">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/artist/' + this.$route.params.id">Cancel</router-link>
        <input v-if="isNew" type="submit" value="Create"/>
        <input v-if="! isNew" type="submit" value="Update"/>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountArtist']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      isNew () {
        return this.$route.params.id === 'new'
      },
      artistId () {
        return this.$route.params.id
      }
    },
    data () {
      return {
        uploadedFile: null,
        fileExtension: null,
        previewImage: null,
        iconUrl: null,
        title: ''
      }
    },
    methods: {
      ...mapActions(['setRef', 'unsetRef']),

      init () {
        if (!this.isNew && this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/artists/' + this.artistId)
          this.setRef({key: 'accountArtist', ref: this.source})
        } else {
          this.source = null
        }
      },

      uploadImage (event) {
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
            case 'image/gif':
              this.fileExtension = 'gif'
              break
            default:
              return
          }
          this.uploadedFile = files[0]
          const reader = new FileReader()
          reader.onload = function (e) {
            this.$bar.finish()
            this.previewImage = e.target.result
          }.bind(this)
          this.$bar.start()
          reader.readAsDataURL(this.uploadedFile)
        }
      },

      removeImage () {
        this.$refs.inputImage.value = ''
        this.previewImage = null
        this.iconUrl = null
      },

      submitArtist () {
        if (!this.accountId) {
          return
        }
        const artist = {
          title: this.title
        }
        const setImage = (ref, data) => {
          return ref.update(data).then(function () {
            this.$router.push('/account/artist/' + ref.key)
          }.bind(this))
        }
        const removeImage = (ref) => {
          const imageUri = this.accountArtist ? this.accountArtist.storageUri : null
          if (imageUri && imageUri.startsWith('gs://')) {
            return firebase.storage().refFromURL(imageUri).delete().then(function () {
              return saveImage(ref)
            })
          } else {
            return saveImage(ref)
          }
        }
        const saveImage = (ref) => {
          if (!this.uploadedFile) {
            return setImage(ref, {
              iconUrl: null,
              storageUri: null
            })
          }
          const filePath = '/accounts/' + this.accountId + '/artists/' + ref.key + '.' + this.fileExtension
          return firebase.storage().ref(filePath).put(this.uploadedFile).then(function (snapshot) {
            return setImage(ref, {
              iconUrl: snapshot.metadata.downloadURLs[0],
              storageUri: firebase.storage().ref(snapshot.metadata.fullPath).toString()
            })
          })
        }
        if (this.isNew) {
          firebase.database().ref('accounts/' + this.accountId + '/artists').push(artist).then(removeImage).catch(log)
        } else if (this.source) {
          this.source.update(artist).then(function () {
            return removeImage(this.source)
          }.bind(this)).catch(log)
        }
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
        this.init()
      },
      'accountArtist' () {
        this.title = this.accountArtist.title
        this.iconUrl = this.accountArtist.iconUrl
      }
    }
  }
</script>
