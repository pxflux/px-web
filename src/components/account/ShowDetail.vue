<template>
  <main>
    <div v-if="userAccount && accountShow" class="wrap-content text-block">
      <router-link to="/account/shows/">Shows</router-link>
      <h1>{{ accountShow.title }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
      <router-link :to="'/place/' + accountShow.place.id">{{ accountShow.place.title }}</router-link>
      <router-link :to="'/account/show/' + showId + '/update'" class="button">Update</router-link>
      <button @click="removeShow">Remove</button>
      <button v-if=" ! accountShow.publicId"><a @click="publishShow">Publish</a></button>
      <button v-if="accountShow.publicId"><a @click="unPublishShow">Un publish</a></button>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase, { publish } from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountShow']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      showId () {
        return this.$route.params.id
      },
      image () {
        return this.accountShow && this.accountShow.image ? this.accountShow.image : {
          displayUrl: null,
          storageUri: null
        }
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/shows/' + this.showId)
          this.setRef({key: 'accountShow', ref: this.source})
        } else {
          this.source = null
        }
      },
      publishShow () {
        if (!this.accountId) {
          return
        }
        publish(this.accountId, 'accounts/' + this.accountId + '/shows/' + this.showId, 'shows').catch(log)
      },
      unPublishShow () {
        if (this.source && this.accountShow.publicId) {
          firebase.database().ref('shows/' + this.accountShow.publicId).remove().then(function () {
            return this.source.update({publicId: null})
          }.bind(this)).catch(log)
        }
      },
      removeShow () {
        if (this.source && this.accountShow) {
          const publicId = this.accountShow.publicId
          const imageUri = this.accountShow.storageUri
          this.source.remove().then(function () {
            if (publicId) {
              return firebase.database().ref('shows/' + publicId).remove()
            }
          }).then(function () {
            if (imageUri && imageUri.startsWith('gs://')) {
              return firebase.storage().refFromURL(imageUri)
            }
          }).then(function () {
            this.$router.push('/account/shows')
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
      }
    }
  }
</script>
