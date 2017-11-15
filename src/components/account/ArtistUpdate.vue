<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/artists/">Artists</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/artist/' + artistId">{{ accountArtist.title }}</router-link>
      </template>
      <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile"
                    @remove-image="setImageRemoved"></image-upload>
      <form id="form-artist" @submit.prevent="submitArtist">
        <input type="text" v-model.trim="title" title="Artist title" required="required">
        <router-link v-if="isNew" to="/account/artists">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/artist/' + artistId">Cancel</router-link>
        <input v-if="isNew" type="submit" value="Create"/>
        <input v-if="! isNew" type="submit" value="Update"/>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase, { store } from '../../firebase-app'

  export default {
    props: ['isNew'],
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
      },
      image () {
        return this.accountArtist && this.accountArtist.image ? this.accountArtist.image : {
          displayUrl: null,
          storageUri: null
        }
      }
    },
    data () {
      return {
        imageFile: null,
        imageRemoved: false,
        title: ''
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (!this.isNew && this.accountId) {
          this.source = firebase.database().ref('accounts/' + this.accountId + '/artists/' + this.artistId)
          this.setRef({key: 'accountArtist', ref: this.source})
        } else {
          this.source = null
        }
      },

      setImageFile (file) {
        this.imageFile = file
      },
      setImageRemoved (flag) {
        this.imageRemoved = flag
      },

      submitArtist () {
        if (!this.accountId) {
          return
        }
        const artist = {
          title: this.title
        }
        const path = '/accounts/' + this.accountId + '/artists'
        store(this.artistId, artist, path, this.imageRemoved, this.imageFile).then(function (ref) {
          this.$router.push('/account/artist/' + ref.key)
        }.bind(this)).catch(log())
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
      }
    }
  }
</script>
