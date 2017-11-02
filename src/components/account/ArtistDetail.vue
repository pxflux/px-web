<template>
  <main>
    <div v-if="user && accountArtist" class="wrap-content text-block">
      <h1>{{ accountArtist.name }}</h1>
      <ul>
        <li><a @click="removeArtist" class="button">Remove</a></li>
        <li v-if=" ! accountArtist.publicId"><a @click="publishArtist" class="button">Publish</a></li>
        <li v-if="accountArtist.publicId"><a @click="unPublishArtist" class="button">Un publish</a></li>
      </ul>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { cloneArtist } from '../../models/artist'
  import { log } from '../../helper'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'accountArtist'])
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_ARTIST']),

      init () {
        if (this.user.uid) {
          this.source = firebase.database().ref('users/' + this.user.uid + '/artists/' + this.$route.params.id)
          this.setRef({key: 'accountArtist', ref: this.source})
        } else {
          this.source = null
          this.REMOVE_ACCOUNT_ARTIST()
        }
      },
      publishArtist () {
        if (this.source && this.accountArtist.publicId === '') {
          const id = firebase.database().ref('/artists').push(cloneArtist(this.accountArtist), log).key
          this.source.update({
            'publicId': id
          }, log)
        }
      },
      unPublishArtist () {
        if (this.source && this.accountArtist.publicId !== '') {
          firebase.database().ref('/artists/' + this.accountArtist.publicId).remove()
          this.source.update({publicId: ''}, log)
        }
      },
      removeArtist () {
        if (this.source) {
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
      }
    }
  }
</script>
