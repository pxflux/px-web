<template>
  <main>
    <div v-if="user" class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in accountArtworks" :artwork="artwork" :key="artwork['.key']"
                   :uri="'/account/artwork/' + artwork['.key']"></ArtworkItem>
      <a @click="showForm = true" class="grid-cell button" title="Add Artwork">
        <div class="button plus center"></div>
      </a>
    </div>
    <span class="nothing-found" v-if="accountArtworks.length == 0">Artworks not found.</span>
    
    <form v-if="showForm" id="form-artwork" @submit.prevent="createArtwork">
      <input type="text" placeholder="Author" v-model="authors">
      <input type="text" placeholder="Title" v-model="title">
      <input type="text" placeholder="Url" v-model="url">
      <input type="text" placeholder="Thumbnail Url" v-model="thumbUrl">
      <button class="right">Create</button>
    </form>
  </main>
</template>

<script>
  import ArtworkItem from '../ArtworkItem'
  import firebase from '../../firebase-app'
  import { mapState, mapMutations, mapActions } from 'vuex'
  // import GridHelper from '../../helpers/grid'
  import { log } from '../../helper'

  export default {
    // mixins: [ GridHelper ],

    created () {
      this.init()
    },
    data () {
      return {
        url: '',
        showForm: false
      }
    },
    computed: {
      ...mapState([ 'user', 'accountArtworks' ])
    },
    methods: {
      ...mapActions([ 'setRef' ]),
      ...mapMutations([ 'REMOVE_ACCOUNT_ARTWORKS' ]),

      init () {
        if (this.user && this.user.uid) {
          this.setRef({
            key: 'accountArtworks',
            ref: firebase.database().ref('users/' + this.user.uid + '/artworks')
          })
        } else {
          this.REMOVE_ACCOUNT_ARTWORKS()
        }
      },
      createArtwork () {
        const newArtwork = {
          url: this.url,
          publicId: '',
          title: '',
          author: ''
        }
        const key = firebase.database().ref('users/' + this.user.uid + '/artworks').push(newArtwork, log).key
        this.$router.push('/account/artwork/' + key)
      }
    },
    components: {
      ArtworkItem
    },
    watch: {
      $route () {
        this.init()
      },
      'user' () {
        this.init()
      },
      accountArtworks () {
        this.$nextTick(function () {
          this.fillEmptySpaceInGrid('grid')
        })
      }
    }
  }
</script>
