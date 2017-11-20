<template>
  <main>
    <div class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in artworks" :artwork="artwork" :key="artwork['.key']"
                   :uri="'/artwork/' + artwork['.key']"></ArtworkItem>
      <span class="nothing-found" v-if="artworks.length == 0">Artworks not found.</span>
    </div>
  </main>
</template>

<script>
  import ArtworkItem from '../ArtworkItem'
  import firebase from '../../firebase-app'
  import { mapState, mapActions } from 'vuex'
  import GridHelper from '../../helpers/grid'

  export default {
    mixins: [GridHelper],

    created () {
      this.init()
    },
    computed: {
      ...mapState(['artworks'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'artworks', ref: firebase.database().ref('artworks')})
      }
    },
    components: {
      ArtworkItem
    },
    watch: {
      $route () {
        this.init()
      },
      'artworks': function () {
        this.$nextTick(function () {
          this.fillEmptySpaceInGrid('grid')
        })
      }
    }
  }
</script>
