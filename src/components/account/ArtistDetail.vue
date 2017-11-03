<template>
  <main>
    <div v-if="user && accountArtist" class="wrap-content text-block">
      <h1>{{ accountArtist.fullName }}</h1>
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
      }
    }
  }
</script>
