<template>
  <main>
    <div class="wrap-content grid">
      <ArtistItem v-for="artist in artists" :artist="artist" :key="artist['.key']"></ArtistItem>
      <span class="nothing-found" v-if="artists.length == 0">Artists not found.</span>
    </div>
  </main>
</template>

<script>
  import ArtistItem from './ArtistItem'
  import firebase from '../firebase'
  import { mapState } from 'vuex'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['artists'])
    },
    methods: {
      init () {
        this.$store.dispatch('setRef', {
          key: 'artists',
          ref: firebase.database().ref('/artists')
        })
      }
    },
    components: {
      ArtistItem
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
