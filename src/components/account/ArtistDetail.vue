<template>
  <main>
    <div v-if="userAccount && accountArtist" class="wrap-content text-block">
      <router-link to="/account/artists/">Artists</router-link>
      <h1>{{ accountArtist.title }}</h1>
      <img v-show="accountArtist.iconUrl" :src="accountArtist.iconUrl" width="100" height="100">
      <router-link :to="'/account/artist/' + artistId + '/update'" class="button">Update</router-link>
      <button @click="removeArtist">Remove</button>
      <button v-if=" ! accountArtist.publicId"><a @click="publishArtist">Publish</a></button>
      <button v-if="accountArtist.publicId"><a @click="unPublishArtist">Un publish</a></button>
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
      ...mapState(['userAccount', 'accountArtist']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      artistId () {
        return this.$route.params.id
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/artists/' + this.artistId)
          this.setRef({key: 'accountArtist', ref: this.source})
        } else {
          this.source = null
        }
      },
      publishArtist () {
        if (!this.accountId) {
          return
        }
        publish(this.accountId, 'accounts/' + this.accountId + '/artists/' + this.showId, 'artists').catch(log)
      },
      unPublishArtist () {
        if (this.source && this.accountArtist.publicId) {
          firebase.database().ref('shows/' + this.accountArtist.publicId).remove().then(function () {
            return this.source.update({publicId: null})
          }.bind(this)).catch(log)
        }
      },
      removeArtist () {
        if (this.source && this.accountArtist) {
          const publicId = this.accountArtist.publicId
          const imageUri = this.accountArtist.storageUri
          this.source.remove().then(function () {
            if (publicId) {
              return firebase.database().ref('artists/' + publicId).remove()
            }
          }).then(function () {
            if (imageUri && imageUri.startsWith('gs://')) {
              return firebase.storage().refFromURL(imageUri)
            }
          }).then(function () {
            this.$router.push('/account/artists')
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
