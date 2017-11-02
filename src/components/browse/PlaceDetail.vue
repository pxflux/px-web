<template>
  <main>
    <div v-if="place" class="wrap-content text-block">
      <h1>{{ place.title }}</h1>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import firebase from '../../firebase-app'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['place'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'place', ref: firebase.database().ref('places/' + this.$route.params.id)})
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
