<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/shows/">Shows</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/show/' + showId">{{ accountShow.title }}</router-link>
      </template>
      <form id="form-show-icon">
        <img v-show="iconUrl && !previewImage" :src="iconUrl" width="100" height="100">
        <img v-show="previewImage" :src="previewImage" width="100" height="100">
        <input ref="inputImage" type="file" accept="image/*" @change="uploadImage">
        <button v-show="iconUrl || previewImage" @click="removeImage">Remove icon</button>
      </form>
      <form id="form-show" @submit.prevent="submitShow">
        <input type="text" v-model="title" title="Show title" required="required">
        <select v-model="placeId">
          <option disabled value="">Выберите один из вариантов</option>
          <option v-for="place in places" v-bind:value="place['.key']">{{ place.title }}</option>
        </select>

        <router-link v-if="isNew" to="/account/shows">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/show/' + this.$route.params.id">Cancel</router-link>
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
      ...mapState(['userAccount', 'accountShow', 'places']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      isNew () {
        return this.$route.params.id === 'new'
      },
      showId () {
        return this.$route.params.id
      }
    },
    data () {
      return {
        uploadedFile: null,
        fileExtension: null,
        previewImage: null,
        iconUrl: null,
        title: '',
        placeId: null
      }
    },
    methods: {
      ...mapActions(['setRef', 'unsetRef']),

      init () {
        if (!this.isNew && this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/shows/' + this.showId)
          this.setRef({key: 'accountShow', ref: this.source})
        } else {
          this.source = null
        }
        this.setRef({key: 'places', ref: firebase.database().ref('places')})
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

      submitShow () {
        if (!this.accountId) {
          return
        }
        if (!this.placeId) {
          return
        }
        const items = this.places.filter(place => place['.key'] === this.placeId)
        if (items.length === 0) {
          return
        }
        const show = {
          title: this.title,
          place: {
            id: items[0]['.key'],
            title: items[0].title
          }
        }
        const setImage = (ref, data) => {
          return ref.update(data).then(function () {
            this.$router.push('/account/show/' + ref.key)
          }.bind(this))
        }
        const removeImage = (ref) => {
          const imageUri = this.accountShow ? this.accountShow.storageUri : null
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
          const filePath = '/accounts/' + this.accountId + '/shows/' + ref.key + '.' + this.fileExtension
          return firebase.storage().ref(filePath).put(this.uploadedFile).then(function (snapshot) {
            return setImage(ref, {
              iconUrl: snapshot.metadata.downloadURLs[0],
              storageUri: firebase.storage().ref(snapshot.metadata.fullPath).toString()
            })
          })
        }
        if (this.isNew) {
          firebase.database().ref('accounts/' + this.accountId + '/shows').push(show).then(removeImage).catch(log)
        } else if (this.source) {
          this.source.update(show).then(function () {
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
      'accountShow' () {
        this.title = this.accountShow.title
        this.iconUrl = this.accountShow.iconUrl
        this.placeId = this.accountShow.place ? this.accountShow.place.id : null
      }
    }
  }
</script>
