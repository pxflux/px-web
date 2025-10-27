<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in artworks" :artwork="artwork" :key="artwork.key" :uri="'/artwork/' + artwork.key"/>
      <router-link to="/account/artwork/new" class="grid-cell button frameless" title="Add Artwork">
        <i class="plus large"></i>
      </router-link>
    </div>
  </main>
</template>

<script>
  import firebaseApp from '../../firebase-app'
  import { getDatabase, ref } from 'firebase/database'
  import { mapState } from 'vuex'
  import { Artwork } from '../../models/ArtworkData'
  import ArtworkItem from '../elements/ArtworkItem.vue'

  export default {
    components: {
      ArtworkItem
    },

    data() {
      return {
        accountArtworks: []
      }
    },

    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      artworks () {
        if (this.accountArtworks) {
          return this.accountArtworks.map(it => Artwork.fromJson(it))
        }
        return []
      }
    },
    methods: {
      init () {
        if (this.accountId) {
          const db = getDatabase(firebaseApp)
          this.$databaseBind('accountArtworks', ref(db, 'accounts/' + this.accountId + '/artworks'))
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
