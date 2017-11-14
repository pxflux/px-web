<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid">
      <ul>
        <li v-for="artist in accountArtists" :key="artist['.key']">
          <router-link :to="'/account/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="accountArtists.length == 0">Artists not found.</span>
      <button v-if="showForm === false" @click="showForm = true">Add Artist</button>
      <form v-if="showForm" id="form-artist" @submit.prevent="createArtist">
        <input type="text" v-model="fullName" title="Artist name" required="required">
        <button class="right">Save</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import latinize from 'latinize'
  import { searchArtists } from '../../models/artist'
  import { log } from '../../helper'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    data () {
      return {
        showForm: false,
        fullName: ''
      }
    },
    computed: {
      ...mapState(['userAccount', 'artists']),

      accountArtists () {
        if (!this.userAccount || !this.artists) {
          return []
        }
        return this.artists.filter(artist => artist.accountId === this.userAccount['.key'])
      }
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.source = firebase.database().ref('artists')
        this.setRef({key: 'artists', ref: this.source})
      },
      createArtist () {
        this.showForm = false
        if (this.source && this.userAccount) {
          const artist = {
            accountId: this.userAccount['.key'],
            fullName: this.fullName,
            photoUrl: '',
            _search_index: {
              full_name: latinize(this.fullName.toLowerCase()),
              reversed_full_name: latinize(this.fullName.toLowerCase().split(' ').reverse().join(' '))
            }
          }
          searchArtists(this.source, this.fullName, 1).then(function (artists) {
            if (Object.keys(artists).length === 0) {
              this.source.push(artist).then(function (data) {
                this.$router.push('/account/artist/' + data.key)
              }.bind(this)).catch(log)
            }
          }.bind(this))
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
