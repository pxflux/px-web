<template>
  <main>
    <div v-if="user" class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in accountArtworks" :artwork="artwork" :key="artwork['.key']"
                   :uri="'/account/artwork/' + artwork['.key']"></ArtworkItem>
      <div class="grid-cell">
        <div><a @click="createArtwork" class="button plus" title="Add Artwork">+</a></div>
      </div>
    </div>
    <span class="nothing-found" v-if="accountArtworks.length == 0">Artworks not found.</span>
  </main>
</template>

<script>
  import ArtworkItem from '../ArtworkItem'
  import firebase from '../../firebase-app'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import GridHelper from '../../helpers/grid'
  import { log } from '../../helper'

  export default {
    mixins: [ GridHelper ],

    created () {
      this.init()
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
          url: '',
          publicId: '',
          title: 'Unnamed',
          author: 'Unknown'
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
