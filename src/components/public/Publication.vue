<template>
  <main>
    <div v-if="publication" class="wrap-content text-block">
      <h1>{{ publication.title }}</h1>
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
      ...mapState(['publication'])
    },
    methods: {
      ...mapActions(['setRef']),

      init () {
        this.setRef({key: 'publication', ref: firebase.database().ref('publications/' + this.$route.params.id)})
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>
