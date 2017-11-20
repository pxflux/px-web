<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in accountArtworks"
                   :artwork="artwork" :key="artwork['.key']"
                   :uri="'/account/artwork/' + artwork['.key']"
                   :private="true">
      </ArtworkItem>
      <router-link to="/account/artwork/new" class="grid-cell button" title="Add Artwork">
        <div class="button plus center"></div>
      </router-link>
    </div>
    <span class="nothing-found" v-if="accountArtworks.length == 0">Artworks not found.</span>
  </main>
</template>

<script>
  import ArtworkItem from '../ArtworkItem'
  import firebase from '../../firebase-app'
  import { mapState, mapActions } from 'vuex'
  import GridHelper from '../../helpers/grid'
  import { ArtworkData } from '../../models/artwork'
  
  export default {
    mixins: [GridHelper],
    components: {
      ArtworkItem
    },
    created () {
      this.init()
      console.log(this.artworks)
    },
    data () {
      return {
        // TODO: Check if it is possible to use accountArtworks directly without making this copy..
        // this will be an array of objects casted to ArtworkData type..
        artworks: []
      }
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
        console.log('::userAccount::')
        console.log(this.userAccount)
        this.init()
      },
      accountArtworks () {
        console.log(':::accountArtworks::: ' + (Array.isArray(this.accountArtworks) ? 'array' : typeof this.accountArtworks))
        console.log(this.accountArtworks)
        const _this = this
        this.accountArtworks.forEach(function (data) {
          // FIX IT this doesn't work because of inheritance.. Vue doesn't recognise methods of classes?
          _this.artworks.push(new ArtworkData(data))
        })
        console.log(':::this.artworks::::: ')
        console.log(this.artworks)
        this.$nextTick(function () {
          this.fillEmptySpaceInGrid('grid')
        })
      }
    }
  }
</script>
