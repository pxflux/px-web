<template>
  <main>
    <div v-if="user" class="wrap-content grid">
      <ul>
        <li v-for="artist in accountArtists" :key="artist['.key']">
          <router-link :to="'/account/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
        </li>
      </ul>
      <span class="nothing-found" v-if="accountArtists.length == 0">Artists not found.</span>
      <ul v-if="showForm === false">
        <li><a @click="showForm = true" class="button">Add Artist</a></li>
      </ul>
      <form v-if="showForm" id="form-artist" @submit.prevent="createArtist">
        <input type="text" v-model="fullName" title="Artist name" required="required">
        <button class="right">Save</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
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
        fullName: '',
        showForm: false
      }
    },
    computed: {
      ...mapState(['user']),
      ...mapGetters(['accountArtists'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.source = firebase.database().ref('artists')
        this.setRef({
          key: 'artists',
          ref: this.source
        })
      },
      createArtist () {
        const newArtist = {
          ownerId: this.user.uid,
          fullName: this.fullName,
          photoUrl: '',
          _search_index: {
            full_name: latinize(this.fullName.toLowerCase()),
            reversed_full_name: latinize(this.fullName.toLowerCase().split(' ').reverse().join(' '))
          }
        }
        searchArtists(this.source, newArtist.fullName, 1).then(function (artists) {
          const artistIds = Object.keys(artists)
          if (artistIds.length === 0) {
            firebase.database().ref('artists').push(newArtist).then(function (data) {
              this.$router.push('/account/artist/' + data.key)
            }.bind(this)).catch(log)
          } else {
            this.showForm = false
          }
        }.bind(this))
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
