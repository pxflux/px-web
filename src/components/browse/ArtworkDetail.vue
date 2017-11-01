<template>
  <main>
    <div v-if="artwork" class="wrap-content text-block">
      <h1 :title="artwork.title">{{ artwork.title }}</h1>
      <p :title="artwork.author">{{ artwork.author }}</p>
      <p :title="artwork.url">{{ artwork.url }}</p>
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
      ...mapState(['artwork'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'artwork', ref: firebase.database().ref('artworks/' + this.$route.params.id)})
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
