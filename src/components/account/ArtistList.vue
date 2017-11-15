<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
      <ul>
        <li v-for="artist in accountArtists" :key="artist['.key']">
          <router-link :to="'/account/artist/' + artist['.key']">{{ artist.title }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="accountArtists.length == 0">Artists not found.</span>
      <router-link to="/account/artist/new/update">Add Artist</router-link>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountArtists']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        if (this.accountId) {
          this.setRef({key: 'accountArtists', ref: firebase.database().ref('accounts/' + this.accountId + '/artists')})
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
