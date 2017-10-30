<template>
  <main>
    <div class="wrap-content">
      <Item v-for="item in artworks" :item="item" :key="item['.key']" :uri="'artworks/' + item['.key']"></Item>
      <span class="nothing-found" v-if="artworks.length == 0">Artworks not found.</span>
    </div>
  </main>
</template>

<script>
  import Item from './Item'
  import firebase from '../firebase'
  import { mapState } from 'vuex'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['user', 'artworks'])
    },
    methods: {
      init () {
        this.$store.dispatch('setArtworksRef', firebase.database().ref('users/' + this.user.uid + '/artworks'))
      }
    },
    components: {
      Item
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
