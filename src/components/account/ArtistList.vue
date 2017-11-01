<template>
  <main>
    <div v-if="user" class="wrap-content grid">
      <ArtistItem v-for="artist in accountArtists" :artist="artist" :key="artist['.key']"></ArtistItem>
      <span class="nothing-found" v-if="accountArtists.length == 0">Artists not found.</span>
      <ul v-if="showForm === false">
        <li><a @click="showForm = true" class="button">Add Artist</a></li>
      </ul>
      <form v-if="showForm" id="form-artist" @submit.prevent="createArtist">
        <input id="name" type="text" v-model="name" title="Artist name" required="required">
        <button class="right">Create</button>
      </form>
    </div>
  </main>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { log } from '../../helper'
  import firebase from '../../firebase'
  import ArtistItem from './ArtistItem'

  export default {
    created () {
      this.init()
    },
    data () {
      return {
        name: '',
        showForm: false
      }
    },
    computed: {
      ...mapState(['user', 'accountArtists'])
    },
    methods: {
      ...mapActions(['setRef']),
      ...mapMutations(['REMOVE_ACCOUNT_ARTISTS']),

      init () {
        if (this.user.uid) {
          this.setRef({
            key: 'accountArtists',
            ref: firebase.database().ref('users/' + this.user.uid + '/artists')
          })
        } else {
          this.REMOVE_ACCOUNT_ARTISTS()
        }
      },
      createArtist () {
        const newArtist = {
          name: this.name,
          publicId: ''
        }
        const key = firebase.database().ref('users/' + this.user.uid + '/artists').push(newArtist, log).key
        this.$router.push('/account/artist/' + key)
      }
    },
    components: {
      ArtistItem
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
