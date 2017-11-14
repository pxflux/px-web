<template>
  <main>
    <div v-if="userAccount && accountShow" class="wrap-content text-block">
      <router-link to="/account/shows/">Shows</router-link>
      <h1>{{ accountShow.title }}</h1>
      <img v-show="accountShow.iconUrl" :src="accountShow.iconUrl" width="100" height="100">
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
  import firebase from '../../firebase-app'

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
        if (!this.source || !this.accountShow) {
          return
        }
        const show = {
          accountId: this.accountId,
          title: this.accountShow.title
        }
        if (this.accountShow.publicId) {
          firebase.database().ref('shows').set(show).catch(log)
        } else {
          firebase.database().ref('shows').push(show).then(function (data) {
            return this.source.update({'publicId': data.key})
          }.bind(this)).catch(log)
        }
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
