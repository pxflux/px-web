<template>
  <main>
    <h1>{{ artist.name }}</h1>
    <h2>Works</h2>
    <h2>Curriculum Vitae</h2>
    <h2>Shows</h2>
  </main>
</template>

<script>
  import { mapState } from 'vuex'
  import firebase from '../firebase'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['artist'])
    },
    methods: {
      init () {
        this.$store.dispatch('setRef', {
          key: 'artist',
          ref: firebase.database().ref('/artists/' + this.$route.params.id)
        })
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
