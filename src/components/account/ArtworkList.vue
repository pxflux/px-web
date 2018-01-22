<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in accountArtworks"
                   :artwork="artwork" :key="artwork['.key']"
                   :uri="'/artwork/' + artwork['.key']">
      </ArtworkItem>
      <router-link to="/account/artwork/new" class="grid-cell button" title="Add Artwork">
          <div class="plus icon"></div>
      </router-link>
    </div>
    <span class="nothing-found" v-if="accountArtworks.length == 0">Artworks not found.</span>
  </main>
</template>

<script>
  import ArtworkItem from '../ArtworkItem'
  import firebase from '../../firebase-app'
  import { mapState, mapActions } from 'vuex'
  // import GridHelper from '../../helpers/grid'

  export default {
    // mixins: [GridHelper],
    components: {
      ArtworkItem
    },
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountArtworks']),

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
          this.setRef({
            key: 'accountArtworks',
            ref: firebase.database().ref('accounts/' + this.accountId + '/artworks')
          })
        }
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
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
