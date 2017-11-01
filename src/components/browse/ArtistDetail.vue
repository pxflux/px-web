<template>
  <main>
    <div v-if="artist" class="wrap-content text-block">
      <h1>{{ artist.name }}</h1>
      <h2>Works</h2>
      <h2>Curriculum Vitae</h2>
      <h2>Shows</h2>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['artist'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({
          key: 'artist',
          ref: firebase.database().ref('artists/' + this.$route.params.id)
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
