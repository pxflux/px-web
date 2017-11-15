<template>
  <main>
    <div v-if="userAccount && accountPlace" class="wrap-content text-block">
      <router-link to="/account/places/">Places</router-link>
      <h1>{{ accountPlace.title }}</h1>
      <img v-show="accountPlace.iconUrl" :src="accountPlace.iconUrl" width="100" height="100">
      <router-link :to="'/account/place/' + placeId + '/update'" class="button">Update</router-link>
      <button @click="removePlace">Remove</button>
      <button v-if=" ! accountPlace.publicId"><a @click="publishPlace">Publish</a></button>
      <button v-if="accountPlace.publicId"><a @click="unPublishPlace">Un publish</a></button>
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
      ...mapState(['userAccount', 'accountPlace']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      placeId () {
        return this.$route.params.id
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/places/' + this.placeId)
          this.setRef({key: 'accountPlace', ref: this.source})
        } else {
          this.source = null
        }
      },
      publishPlace () {
        if (!this.accountId) {
          return
        }
        publish(this.accountId, 'accounts/' + this.accountId + '/places/' + this.showId, 'places').catch(log)
      },
      unPublishPlace () {
        if (this.source && this.accountPlace.publicId) {
          firebase.database().ref('shows/' + this.accountPlace.publicId).remove().then(function () {
            return this.source.update({publicId: null})
          }.bind(this)).catch(log)
        }
      },
      removePlace () {
        if (this.source && this.accountPlace) {
          const publicId = this.accountPlace.publicId
          const imageUri = this.accountPlace.storageUri
          this.source.remove().then(function () {
            if (publicId) {
              return firebase.database().ref('places/' + publicId).remove()
            }
          }).then(function () {
            if (imageUri && imageUri.startsWith('gs://')) {
              return firebase.storage().refFromURL(imageUri)
            }
          }).then(function () {
            this.$router.push('/account/places')
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
